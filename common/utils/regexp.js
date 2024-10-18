// https://regex101.com/r/vkijKf/1/
// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
module.exports.semver_version_regexp = /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/


// format: __<key>__ = <value>
// example: __package__ = 'my-package' or __created__ = 123456789
module.exports.metadata_py_regexp_by_key = (key = '') => {
  return new RegExp(`(?:\\_\\_${key}\\_\\_)(?:[\\s]+)?\\=(?:[\\s]+)?(?:[\\"|\\'])?([a-zA-Z0-9-_.+,\\$\\@\\s]+)?(?:[\\"|\\'])?`, 'im')
}


// format: <Key>: <value>
// example: Package: my-package
module.exports.debian_control_regexp_by_key = (key = '') => {
  return new RegExp(`(?:${key})(?:[\\s])?\\:(?:[\\s])?(?:[\\"|\\'])?([a-zA-Z0-9-_.+\\$\\@\\S]+)?(?:[\\"|\\'])?`, 'im')
}


// format: "<key>": "<value>"
// example: "package": "my-package" or "created": 12345678
module.exports.json_regexp_by_key = (key) => {
  return new RegExp(`(?:[\\"|\\'])(?:${key})(?:[\\"|\\'])[\\s+]?\\:[\\s+]?(?:[\\"|\\'])?(true|false|[0-9a-zA-Z\\+\\-\\,\\.\\$\\@\\s]*)?(?:[\\"|\\'])?`, 'im')
}


// https://regex101.com/r/d2tLsh/1
// regular expression inspection on line example: my-package (1.0.5-201808221630) UNRELEASED; urgency=medium
// @NOTE: take only first line
module.exports.version_changelog_regexp = /^[\w-]+[\s]\((\d{1,3}\.\d{1,3}.\d{1,3})?[-_]?([a-zA-Z0-9-_.+]+)\)/i
