const process = require("node:process");
const child_process = require("node:child_process");

const { semverVersionRegexp } = require("./regexp");

/**
 * exec cli method that returns a promise
 * @param {String} command cli command
 * @param {Object} options cli command options
 * @returns {Promise} promise function
 */
module.exports.execAsync = (command, options = { log: false, cwd: process.cwd() }) => {
  if (options.log) console.log(command);
  return new Promise((resolve, reject) => {
    child_process.exec(command, { ...options }, (err, stdout, stderr) => {
      if (err) {
        err.stdout = stdout !== "" ? stdout : null;
        err.stderr = stderr !== "" ? stderr : null;
        return reject(err);
      }

      stderr = stderr !== "" ? stderr : null;
      return resolve({ stdout, stderr });
    });
  });
};

/**
 * test a command depending of a pattern
 * @param {String} command cli command
 * @param {Object} inject_default_patterns inject default patterns provided in the method
 * @param {String|Array} patterns patterns to looking for to detect if a command is not supported
 * @returns {Promise} promise function
 */
module.exports.testCommand = (command, inject_defaults_unsupported_patterns = true, unsupported_patterns = []) => {
  return new Promise((resolve, reject) => {
    exec_async(command)
      .then(({ stdout, stderr }) => {
        if (stderr) {
          return reject(false);
        }
        // detect if we found a version in command line
        if ((version = stdout.match(semver_version_regexp)) != null) {
          // return version value
          return resolve(version[0]);
        } else {
          // always be ok
          return resolve(true);
        }
      })
      .catch((err) => {
        // determine depending of the pattern if a command is supported or not
        if (typeof unsupported_patterns == "string") {
          unsupported_patterns = [unsupported_patterns];
        }

        const defaults_patterns = ["command not found", "commande introuvable"];
        if (inject_defaults_unsupported_patterns) {
          unsupported_patterns = [...defaults_patterns, ...unsupported_patterns];
        }

        const is_pattern_found = unsupported_patterns.some((p) => err.stderr.indexOf(p) != -1);
        return resolve(!is_pattern_found);
      });
  });
};
