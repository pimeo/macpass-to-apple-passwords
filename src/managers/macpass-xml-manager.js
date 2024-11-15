class MacpassXmlManager {
  constructor() {}

  /**
   * Return if group is considered as trashed
   * @param {object} group macpass node group
   * @returns {Boolean}
   */
  isTrashedGroup(group) {
    // check if group is considered as trashed group
    return (
      "False" === group.EnableAutoType[0] &&
      "False" === group.EnableSearching[0]
    );
  }

  extractGroupsFromXmlTree(xmlTree) {
    const groups = [];
    for (const originalGroup of xmlTree.KeePassFile.Root[0].Group) {
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
        isTrashed: this.isTrashedGroup(originalGroup)
      };

      if (originalGroup.Group) {
        for (const originalSubGroup of originalGroup.Group) {
          const subGroup = {
            ...structuredClone(groupSchema),
            uuid: originalSubGroup.UUID[0],
            name: originalSubGroup.Name[0],
            parentUuid: group.uuid,
            isTrashed: this.isTrashedGroup(originalSubGroup)
          };

          groups.push(subGroup);
        }
      }

      groups.push(group);
    }

    return groups;
  }

  parseEntryAttribute(entryAttribute, entries = []) {
    // deals with Group attributes inside the Group attribute
    if (entryAttribute.Group) {
      for (const subGroup of entryAttribute.Group) {
        this.parseEntryAttribute(subGroup, entries);
      }
    }

    // ensure there are entries in Group attribute
    if (Array.isArray(entryAttribute.Entry)) {
      for (const originalEntry of entryAttribute.Entry) {
        // console.log("entryAttribute", originalEntry);

        // ensure it's a entry and not a group of group
        const stringsMetadatas = {};
        for (const str of originalEntry.String) {
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

  extractEntriesFromXmlTree(xmlTree) {
    let entries = [];
    for (const originalGroup of xmlTree.KeePassFile.Root[0].Group) {
      this.parseEntryAttribute(originalGroup, entries);
    }

    return entries;
  }

  linkGroupsToEntries(groups, entries) {
    // link groups to entries
    entries.map((entry) => {
      const group =
        groups.filter((group) => group.uuid === entry.groupUuid)[0] || null;
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

    return {
      entries,
      groups
    };
  }
}

module.exports = MacpassXmlManager;
