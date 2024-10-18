const semver = require('semver')

// 
// Validation constants
// 

module.exports.mailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// text without space validation
module.exports.validateTextNoSpace = (value) => {
  // name validation
  if (typeof value != "string" || value == "" || value.length < 3) {
    return 'Name must not be empty and contains at least 3 characters'
  }

  // prevent directory name with space
  if (value.indexOf(' ') !== -1) {
    return "Name must not contain space"
  }

  return true
}


// basic text validation
module.exports.validateText = (value) => {
  // name validation
  if (typeof value != "string" || value == "" || value.length < 3) {
    return 'Name must not be empty and contains at least 3 characters'
  }

  return true
}


// basic text validation
module.exports.validateEmail = (value) => {
  if (!mailRegExp.test(value)) {
    return 'Invalid email'
  }
  return true
}


// validate version
module.exports.validateVersion = (value) => {
  if (!semver.valid(value)) {
    return 'Invalid version format. Can be 0.0.1, 0.0.1-dev.0 or 0.0.1-rc.1+build.abcdef'
  }
  return true
}
