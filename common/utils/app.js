//
// dotenv loading environnment configurations
//
const process = require("node:process");
const { castEnvVars } = require("./dotfile.js");

class App {
  constructor() {
    this.context = {};
    this.program = null;
  }

  initializeEnvironmentVars() {
    const env = require("dotenv").config({
      path: `.env.${process.env.NODE_ENV}`
    });
    if (env.error) {
      throw env.error;
    }

    return env;
  }

  initializeContext() {
    const envVars = this.initializeEnvironmentVars();

    this.context = {
      env: process.env.NODE_ENV,
      cwd: process.cwd(),
      ...castEnvVars(envVars.parsed)
    };

    return this;
  }

  getContext() {
    return this.context;
  }

  getProgram() {
    return this.program;
  }

  /**
   * Set program
   * @param {Program} program
   * @returns
   */
  setProgram(program) {
    this.program = program;

    return this;
  }
}

module.exports = App;
