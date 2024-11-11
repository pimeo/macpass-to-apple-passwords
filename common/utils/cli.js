const process = require("node:process");

/**
 * Before action hook
 * @param {App} app application instance
 * @param {string} actionValue
 * @param {object} commandOptions
 */
module.exports.beforeActionHook = (app, actionValue, commandOptions) => {
  // debug mode status check
  if (app.getProgram().debug) {
    // override the logger console to level "debug" if debug mode is enabled
    const consoleLogger = process.logger.transports.filter((t) => t.name == "console")[0] || null;
    if (consoleLogger) {
      consoleLogger.level = "debug";
      process.logger.DEBUG_MODE_ENABLED = true;
    }
  }

  if (!app.getProgram().silent) {
    // welcome message
    const welcomeMessage = require("./style.js").welcomeMessage;
    const packageJson = require("./../../package.json");
    welcomeMessage({
      cli_version: packageJson.version,
      debug: app.getProgram().debug || false,
      silent: app.getProgram().silent || false,
      ...app.getContext()
    });
  }
};

/**
 * After action hook
 * * @param {App} app application instance
 * @param {string} actionValue
 */
module.exports.afterActionHook = (app, actionValue) => {
  // close the logger process besides it is a syslog (else the program won't be exited)
  if (process.logger) {
    process.logger.close();
  }
};

/**
 * Command inject global program options hook
 * * @param {App} app application instance
 * @param {object} actionValue
 * @return commandOptions
 */
module.exports.injectGlobalOptionsHook = (app, commandOptions) => {
  commandOptions.debug = app.getProgram().debug || false;
  commandOptions.silent = app.getProgram().silent || false;
  return commandOptions;
};
