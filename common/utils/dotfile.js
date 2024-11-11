const process = require("node:process");

// 
// Dotenv parser
// Inspired by https://github.com/niftylettuce/dotenv-parse-variables
// 

const DEFAULT_OPTIONS = {
  assignToProcessEnv: true,
  overrideProcessEnv: false
};

const logger = process.logger || null

const parseKey = (value, key) => {
  logger.debug(`parsing key ${key} with value ${value}`);

  // if the value is wrapped in bacticks e.g. (`value`) then just return its value
  if (value.toString().indexOf('`') === 0
    && value.toString().lastIndexOf('`') === value.toString().length - 1) {
    logger.debug(`key ${key} is wrapped in bacticks and will be ignored from parsing`);
    return value.toString().substring(1, value.toString().length - 1);
  }

  // if the value ends in an asterisk then just return its value
  if (value.toString().lastIndexOf('*') === value.toString().length - 1
    && value.toString().indexOf(',') === -1) {
    logger.debug(`key ${key} ended in * and will be ignored from parsing`);
    return value.toString().substring(0, value.toString().length - 1);
  }

  // Boolean
  if (value.toString().toLowerCase() === 'true' || value.toString().toLowerCase() === 'false') {
    logger.debug(`key ${key} parsed as a Boolean`);
    return value.toString().toLowerCase() === 'true';
  }

  // Number
  if (!isNaN(value)) {
    logger.debug(`key ${key} parsed as a Number`);
    return Number(value);
  }

  // Array
  if (value.indexOf(',') !== -1) {
    logger.debug(`key ${key} parsed as an Array`);
    return value.split(',').map(parseKey);
  }

  return value;
}

module.exports.castEnvVars = (env, options) => {
  const envOptions = Object.assign({}, DEFAULT_OPTIONS, options || {});

  Object.keys(env).forEach(key => {
    logger.debug(`key "${key}" before type was ${typeof env[key]}`);
    if (env[key]) {
      env[key] = parseKey(env[key], key);
      logger.debug(`key "${key}" after type was ${typeof env[key]}`);
      if (envOptions.assignToProcessEnv === true) {
        if (envOptions.overrideProcessEnv === true) {
          process.env[key] = env[key] || process.env[key];
        } else {
          process.env[key] = process.env[key] || env[key];
        }
      }
    }
  });

  return env;

};
