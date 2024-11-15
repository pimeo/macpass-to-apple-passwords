//
// https://github.com/iamkun/dayjs
//

const dayjs = require("dayjs");
// support utc timezone
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

/**
 * Return a custom dayjs instance
 * @param {Datetime|String} date
 * @param {Object} options
 * @param {String} locale
 * @returns {Object}
 */
module.exports.dayjs = (date = null, options = {}, locale = "en") => {
  return dayjs(date || new Date(), options, locale);
};

/**
 * Format a date
 * @param {String} template dayjs date string format
 * @param {Datetime|String} date date
 * @param {Object} options
 * @param {String} locale
 * @returns {String}
 */
module.exports.dayjsFormat = (template, date, options = {}, locale = "en") => {
  return dayjs(date || new Date(), options, locale).format(template);
};
