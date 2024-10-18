// 
// https://github.com/iamkun/dayjs
// 

const dayjs = require('dayjs')
const utc = require("dayjs/plugin/utc")
dayjs.extend(utc)

module.exports.dayjs = (date = null, options = {}, locale = 'en') => {
  return dayjs(date || new Date(), options, locale)
}

module.exports.dayjsFormat = (template, date, options = {}, locale = 'en') => {
  return dayjs(date || new Date(), options, locale).format(template)
}
