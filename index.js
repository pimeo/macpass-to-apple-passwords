#!/usr/bin/env node

const process = require("node:process");
process.env.NODE_ENV = process.env.NODE_ENV
  ? process.env.NODE_ENV
  : "production";

// logger
const { createLogger } = require("./common/utils/logger.js");
process.logger = createLogger();

// cli hooks
const {
  beforeActionHook,
  afterActionHook,
  injectGlobalOptionsHook
} = require("./common/utils/cli");

// cli program initialization
const { program } = require("commander");
program.version("0.1.0");
program
  .option("-d, --debug", "debug mode")
  .option("-s, --silent", "silent mode");

// application initialization
const App = require("./common/utils/app.js");
const app = new App();
app.initializeContext().setProgram(program);

// Enumerate available tasks

// node command: node index macpass-xml-to-apple-password-csv
// npm command: npm run cli macpass-xml-to-apple-password-csv
program
  .command("macpass-xml-to-apple-password-csv")
  .description(
    "Generate a Apple Password Application compatible csv file from a Macpass exported xml file."
  )
  .requiredOption("-i, --input-xml-filepath <inputXmlFilepath>", "Macpass XML input file")
  .requiredOption(
    "-o, --output-csv-file <outputCsvFile>",
    "Apple Passwords output file"
  )
  .action(async (commandOptions) => {
    injectGlobalOptionsHook(app, commandOptions);
    beforeActionHook(app, "macpass-xml-to-apple-password-csv", commandOptions);
    await require("./tasks/macpass-xml-to-apple-password-csv.js")(
      {},
      commandOptions,
      app
    );
    afterActionHook(app, "macpass-xml-to-apple-password-csv");
  });

app.getProgram().parse(process.argv);
// @DEBUG: list all global command options:
// console.log(program.opts())
