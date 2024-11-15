const process = require("node:process");
const { castEnvVars } = require("./dotfile.js");

class App {
  constructor() {
    this.context = {};
    this.program = null;
  }

  /**
   * Initialize environment variables
   * @returns {Object} env variables
   */
  initializeEnvironmentVars() {
    const env = require("dotenv").config({
      path: `.env.${process.env.NODE_ENV}`
    });
    if (env.error) {
      throw env.error;
    }

    return env;
  }

  /**
   * Initialize the application context
   * @returns {this}
   */
  initializeContext() {
    const envVars = this.initializeEnvironmentVars();

    this.context = {
      env: process.env.NODE_ENV,
      cwd: process.cwd(),
      ...castEnvVars(envVars.parsed)
    };

    return this;
  }

  /**
   * Return the application context
   * @returns {Object}
   */
  getContext() {
    return this.context;
  }

  /**
   * Return commander cli program
   * @returns {Program}
   */
  getProgram() {
    return this.program;
  }

  /**
   * Set commander cli program
   * @param {Program} program
   * @returns
   */
  setProgram(program) {
    this.program = program;

    return this;
  }
}

module.exports = App;
