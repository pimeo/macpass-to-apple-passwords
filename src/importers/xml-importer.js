const xml2js = require("xml2js");
const fs = require("fs").promises;

class XmlImporter {
  constructor() {
    this.filepath = null;
  }

  setFilepath(filepath) {
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

module.exports = XmlImporter
