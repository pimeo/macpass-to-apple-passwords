// 
// https://github.com/winstonjs/winston
// https://github.com/winstonjs/logform
// 

const winston = require('winston')
const format = require('logform').format
const path = require('node:path')
const process = require("node:process");

const logFileMaxsize = 20480
const logFileMaxfiles = undefined

// log directory
const logDirectory = path.resolve(process.cwd(), 'logs')

// console terminal format
const console_format = format.combine(
  format.colorize(),
  format.align(),
  format.splat(),
  format.simple()
)

// logger file format
const file_format = format.combine(
  format.timestamp(),
  format.align(),
  format.splat(),
  format.printf(info => {
    const timestamp = new Date(info.timestamp).toISOString()
    return `${timestamp} [${process.pid}] ${info.level}: ${info.message}`
  })
)

// create a logger instance
module.exports.createLogger = () => {
  let loggerOptions = {
    level: 'info',
    levels: winston.config.syslog.levels,
  }

  if (process.env.NODE_ENV == "development") {
    loggerOptions.transports = [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({
        filename: path.join(logDirectory, 'error.log'),
        level: 'error',
        maxFiles: logFileMaxfiles,
        maxsize: logFileMaxsize,
        format: file_format
      }),

      new winston.transports.File({
        filename: path.join(logDirectory, 'combined.log'),
        maxFiles: logFileMaxfiles,
        maxsize: logFileMaxsize,
        format: file_format
      }),

      new winston.transports.Console({
        name: 'console',
        format: console_format,
        // set to 'debug' if --debug cli arg is enabled
        level: 'debug',
      })
    ]
  } else {
    // register only a syslog
    require('winston-syslog').syslog

    loggerOptions.transports = [
      new winston.transports.Syslog(),

      new winston.transports.Console({
        name: 'console',
        format: console_format,
        // set to 'debug' if --debug cli arg is enabled
        level: 'info',
      })
    ]
  }

  return winston.createLogger(loggerOptions)
}

// special method to call a logger in test mode
module.exports.createTestingLogger = () => {
  const logger = winston.createLogger({
    level: 'info',
    transports: [
      new winston.transports.Console({
        name: 'console',
        format: console_format,
        // set to 'debug' if --debug cli arg is enabled
        level: 'info',
      })
    ]
  })

  return logger
}

module.exports.debugVerbose = (...logs) => {
  // custom flag to detect debug mode from cli arg
  if (process.logger && process.logger.DEBUG_MODE_ENABLED) {
    const msg = logs.reduce((acc) => acc += "\n%s", "")
    process.logger.debug(msg, ...logs)
  }
}
