const path = require("path");
const xml2js = require("xml2js");
const fs = require("fs").promises;
const process = require("node:process");

class XMLImporter {
  constructor() {
    this.inputFilepath = null;
  }

  setInputFilePath(filepath) {
    this.filepath = filepath;
    return this;
  }

  async readFile() {
    return await fs.readFile(this.filepath, { encoding: "utf-8" });
  }

  async parseXml() {
    const parser = xml2js.Parser({});
    return await parser.parseStringPromise(await this.readFile());
  }
}

class CSVExporter {
  constructor() {
    this.outputFilepath = null;
    this.outputFilename = null;
  }

  setOutputFilename(outputFilename) {
    this.outputFilename = outputFilename;

    return this;
  }

  getOutputFilename() {
    return this.outputFilename;
  }

  async createFileFromValues(values) {
    // "Title","URL","Username","Password","Notes","OTPAuth"
    const data = values.reduce((acc, value) => {
      acc += `"${value.title}", "${value.url}", "${value.userName}", "${value.password}", "${value.notes}", ""\n`;
      return acc;
    }, `Title, URL, Username, Password, Notes, OTPAuth\n`);

    return await fs.writeFile(path.join(process.cwd(), "outputs", this.outputFilename), data, { encoding: "utf-8" });
  }
}

module.exports = async (commandArguments, options, context) => {
  console.log("[Task] macpass-xml-to-apple-password-csv");
  // console.log('commandArguments', commandArguments)
  // console.log('options', options)

  const XmlImporter = new XMLImporter().setInputFilePath(path.resolve(process.cwd(), "./samples/macpass-backup-1.xml"));
  const contents = await XmlImporter.parseXml();
  // console.log('contents', contents.KeePassFile.Root[0].Group)
  // console.log('contents', contents.KeePassFile.Root[0].Group[0].Group[0].Entry)
  // console.log('contents', contents.KeePassFile.Root[0].Group[0].Group[0].Entry[0].String[0].Key)

  // const mainGroup = contents.KeePassFile.Root[0].Group[0];

  // ---
  // parse groups
  // ---
  const isTrashedGroup = (group) => {
    // check if group is considered as trashed group
    return "False" === group.EnableAutoType[0] && "False" === group.EnableSearching[0];
  };

  const groups = [];
  for (const originalGroup of contents.KeePassFile.Root[0].Group) {
    const groupSchema = {
      uuid: null,
      name: null,
      parentUuid: null,
      items: 0,
      itemsUuid: [],
      isTrashed: false
    };

    const group = {
      ...structuredClone(groupSchema),
      uuid: originalGroup.UUID[0],
      name: originalGroup.Name[0],
      isTrashed: isTrashedGroup(originalGroup)
    };

    if (originalGroup.Group) {
      for (const originalSubGroup of originalGroup.Group) {
        const subGroup = {
          ...structuredClone(groupSchema),
          uuid: originalSubGroup.UUID[0],
          name: originalSubGroup.Name[0],
          parentUuid: group.uuid,
          isTrashed: isTrashedGroup(originalSubGroup)
        };

        groups.push(subGroup);
      }
    }

    groups.push(group);
  }

  // console.log("groups", JSON.stringify(groups, null, 2));
  // console.log("groups", groups);

  // ---
  // parse entries
  // ---

  function parseEntryAttribute(entryAttribute, entries = []) {
    // deals with Group attributes inside the Group attribute
    if (entryAttribute.Group) {
      for (const subGroup of entryAttribute.Group) {
        parseEntryAttribute(subGroup, entries);
      }
    }

    // ensure there are entries in Group attribute
    if (Array.isArray(entryAttribute.Entry)) {
      for (const originalEntry of entryAttribute.Entry) {
        // console.log("entryAttribute", originalEntry);

        // ensure it's a entry and not a group of group
        const stringsMetadatas = {};
        for (str of originalEntry.String) {
          const key = str.Key[0];
          if ("Password" === key) {
            stringsMetadatas[key] = str.Value[0]._;
          } else {
            stringsMetadatas[key] = str.Value[0];
          }
        }

        const entry = {
          uuid: originalEntry.UUID[0],
          title: stringsMetadatas.Title,
          userName: stringsMetadatas.UserName,
          password: stringsMetadatas.Password,
          url: stringsMetadatas.URL,
          notes: stringsMetadatas.Notes,
          createdAt: originalEntry.Times[0].CreationTime[0],
          lastAccessedAt: originalEntry.Times[0].LastAccessTime[0],
          groupUuid: entryAttribute.UUID[0],
          isTrashed: false
        };

        entries.push(entry);
      }
    }

    return entries;
  }

  let entries = [];
  for (const originalGroup of contents.KeePassFile.Root[0].Group) {
    parseEntryAttribute(originalGroup, entries);
  }

  // console.log("entries", entries);
  // console.log("total entries", entries.length);
  // console.log(entries.filter((entry) => entry.title === "test"));
  // console.log(entries.map((entry) => entry.title === "test"));

  // link groups to entries
  entries.map((entry) => {
    const group = groups.filter((group) => group.uuid === entry.groupUuid)[0] || null;
    if (group) {
      group.items += 1;
      group.itemsUuid.push(entry.uuid);
    }

    // detect trash group
    // if ("Corbeille" === group.name) {
    if (true === group.isTrashed) {
      // group.isTrashed = true;
      entry.isTrashed = true;
    }

    return entry;
  });

  // trashed entries and groups
  // console.log(entries.filter((entry) => entry.isTrashed));
  // console.log(groups.filter((group) => group.isTrashed));

  // console.log(groups);

  const csvExporter = new CSVExporter();
  csvExporter.setOutputFilename("file.csv").createFileFromValues(entries);
};
