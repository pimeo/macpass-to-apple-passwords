const process = require("node:process");

module.exports.exitIfNeeded = (error_msg = null, code = 1) => {
  if (error_msg != null && error_msg != "") {
    // use process else console to show error found message
    (process.logger ? process.logger : console).error("--- Error found");
    console.log(error_msg);
    process.exit(code);
  }
};
