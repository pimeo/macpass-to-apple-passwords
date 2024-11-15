const path = require("path");
const process = require("node:process");
const XmlImporter = require("./../src/importers/xml-importer.js");
const MacpassXmlManager = require("./../src/managers/macpass-xml-manager.js");
const ApplePasswordCsvExporter = require("./../src/exporters/apple-password-csv-exporter.js");

module.exports = async (commandArguments, options, app) => {
  process.logger.info("[Task] macpass-xml-to-apple-password-csv");

  const xmlImporter = new XmlImporter().setFilepath(
    path.resolve(process.cwd(), options.inputXmlFilepath)
  );

  // parse xml contents
  const contents = await xmlImporter.parseXml();

  // create a macpass xml manager to handle xml raw contents
  const macpassXmlManager = new MacpassXmlManager();

  // extract groups
  const groups = macpassXmlManager.extractGroupsFromXmlTree(contents);

  // extract entries
  const entries = macpassXmlManager.extractEntriesFromXmlTree(contents);

  // export macpass entries to a apple password app compatible format csv file
  const applePasswordCsvExporter = new ApplePasswordCsvExporter();
  try {
    const outputFilepath = await applePasswordCsvExporter.createFileFromValues(
      entries,
      options.outputCsvFile ?? "generated-file.csv"
    );
    process.logger.info(`File created at ${outputFilepath}`);
  } catch (err) {
    process.logger.warning("Unable to create csv file", err);
  }

  // -- generate some stats

  // link groups to entries
  const { groups: linkedGroups, entries: linkedEntries } =
    macpassXmlManager.linkGroupsToEntries(groups, entries);

  process.logger.info(`Count of groups: ${linkedGroups.length}`);
  process.logger.info(`Count of entries: ${linkedEntries.length}`);

  // trashed entries and groups
  const trashedEntries = entries.filter((entry) => entry.isTrashed);
  const trashedGroups = groups.filter((group) => group.isTrashed);

  process.logger.info(`Count of trashed groups: ${trashedGroups.length}`);
  process.logger.info(`Count of trashed entries: ${trashedEntries.length}`);

  process.logger.info(`[Task] terminated task`)
};
