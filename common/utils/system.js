/**
 * Force a system sleep
 * @param {int} ms
 * @returns {Promise}
 */
module.exports.sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
