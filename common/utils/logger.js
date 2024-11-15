//
// https://github.com/winstonjs/winston
// https://github.com/winstonjs/logform
//

const winston = require("winston");
const format = require("logform").format;
const path = require("node:path");
const process = require("node:process");

const logFileMaxsize = 20480;
const logFileMaxfiles = undefined;

// log directory
const logDirectory = path.resolve(process.cwd(), "logs");

// console terminal format
const console_format = format.combine(
  format.colorize(),
  format.align(),
  format.splat(),
  format.simple()
);

// logger file format
const loggerFileFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.splat(),
  format.printf((info) => {
    const timestamp = new Date(info.timestamp).toISOString();
    return `${timestamp} [${process.pid}] ${info.level}: ${info.message}`;
  })
);

/**
 * Create a logger instance
 * @returns {Logger}
 */
module.exports.createLogger = () => {
  let loggerOptions = {
    level: "info",
    levels: winston.config.syslog.levels
  };

  if (process.env.NODE_ENV == "development") {
    loggerOptions.transports = [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({
        filename: path.join(logDirectory, "error.log"),
        level: "error",
        maxFiles: logFileMaxfiles,
        maxsize: logFileMaxsize,
        format: loggerFileFormat
      }),

      new winston.transports.File({
        filename: path.join(logDirectory, "combined.log"),
        maxFiles: logFileMaxfiles,
        maxsize: logFileMaxsize,
        format: loggerFileFormat
      }),

      new winston.transports.Console({
        name: "console",
        format: console_format,
        // set to 'debug' if --debug cli arg is enabled
        level: "debug"
      })
    ];
  } else {
    // register only a syslog
    require("winston-syslog").syslog;

    loggerOptions.transports = [
      new winston.transports.Syslog(),

      new winston.transports.Console({
        name: "console",
        format: console_format,
        // set to 'debug' if --debug cli arg is enabled
        level: "info"
      })
    ];
  }

  return winston.createLogger(loggerOptions);
};

/**
 * Special method to call a logger in test mode
 * @returns {Logger}
 */
module.exports.createTestingLogger = () => {
  const logger = winston.createLogger({
    level: "info",
    transports: [
      new winston.transports.Console({
        name: "console",
        format: console_format,
        // set to 'debug' if --debug cli arg is enabled
        level: "info"
      })
    ]
  });

  return logger;
};

/**
 * Detect debug mode flag from cli arg and display more information in terminal prompt
 * @param  {...any} logs
 */
module.exports.debugVerbose = (...logs) => {
  if (process.logger && process.logger.DEBUG_MODE_ENABLED) {
    const msg = logs.reduce((acc) => (acc += "\n%s"), "");
    process.logger.debug(msg, ...logs);
  }
};
