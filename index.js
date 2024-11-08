#!/usr/bin/env node

//
// logger
//
const utilsLogger = require("./common/utils/logger.js");

process.logger = utilsLogger.createLogger();

//
// Commander CLI
//
// https://github.com/tj/commander.js/
// <value> -> required argument
// [value] -> optional argument
// [otherDirs...] -> variadic argument
// .command('list', 'list packages installed', {isDefault: true})
// .command('update', 'update installed packages', {executableFile: 'myUpdateSubCommand'})
const { program } = require("commander");
program.version("0.1.0");
program.option("-d, --debug", "debug mode").option("-s, --silent", "silent mode");

//
// dotenv loading environnment configurations
//
const { castEnvVars } = require("./common/utils/dotfile.js");
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "production";
const env = require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
});
if (env.error) {
  throw env.error;
}

//
// context declaration
//
const context = {
  env: process.env.NODE_ENV,
  cwd: process.cwd(),
  ...castEnvVars(env.parsed)
};

//
// Command before action hook
//
const beforeActionHook = (action_value, commandOptions) => {
  // debug mode status check
  if (program.debug) {
    // override the logger console to level "debug" if debug mode is enabled
    const console_logger = process.logger.transports.filter((t) => t.name == "console")[0] || null;
    if (console_logger) {
      console_logger.level = "debug";
      process.logger.DEBUG_MODE_ENABLED = true;
    }
  }

  if (!program.silent) {
    // welcome message
    const welcomeMessage = require("./common/utils/style.js").welcomeMessage;
    const package_json = require("./package.json");
    welcomeMessage({
      cli_version: package_json.version,
      debug: program.debug || false,
      silent: program.silent || false,
      ...context
    });
  }
};

//
// Command after action hook
//
const afterActionHook = (action_value) => {
  // close the logger process besides it is a syslog (else the program won't be exited)
  if (process.logger) {
    process.logger.close();
  }
};

//
// Command inject global program options hook
//
const injectGlobalOptionsHook = (commandOptions) => {
  commandOptions.debug = program.debug || false;
  commandOptions.silent = program.silent || false;
  return commandOptions;
};

//
// Listing of debian commands available
//

// Hello world task
// node command: node index hello-world
// npm command: npm run cli hello-world
program
  .command("hello-world")
  .description("Says hello world")
  .action(async (commandOptions) => {
    injectGlobalOptionsHook(commandOptions);
    beforeActionHook("hello-world", commandOptions);
    await require("./tasks/hello-world")({}, commandOptions, context);
    afterActionHook("hello-world");
  });

//
// node command: node index macpass-xml-to-apple-password-csv
// npm command: npm run cli macpass-xml-to-apple-password-csv
program
  .command("macpass-xml-to-apple-password-csv")
  .description("Generate a Apple Password Application compatible csv file from a Macpass exported xml file.")
  .requiredOption("-i, --input-xml-file <inputFile>", "Macpass input file")
  .requiredOption("-o, --output-csv-file <outputFile>", "Apple Passwords output file")
  .action(async (commandOptions) => {
    injectGlobalOptionsHook(commandOptions);
    beforeActionHook("macpass-xml-to-apple-password-csv", commandOptions);
    await require("./tasks/macpass-xml-to-apple-password-csv.js")({}, commandOptions, context);
    afterActionHook("macpass-xml-to-apple-password-csv");
  });

program.parse(process.argv);
// @DEBUG: list all global command options:
// console.log(program.opts())