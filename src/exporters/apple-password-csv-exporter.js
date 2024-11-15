const path = require("path");
const process = require("node:process");
const fs = require("fs").promises;

class ApplePasswordCsvExporter {
  constructor() {}

  async createFileFromValues(values, outputFilename) {
    // "Title","URL","Username","Password","Notes","OTPAuth"
    const data = values.reduce((acc, value) => {
      if (false === value.isTrashed) {
        acc += `"${value.title}","${value.url}","${
          value.userName
        }","${value.password.replaceAll('"', '\\"')}","${
          value.notes
        } - Import Macpass",""\n`;
      }
      return acc;
    }, `Title,URL,Username,Password,Notes,OTPAuth\n`);

    const outputFilepath = path.join(process.cwd(), "outputs", outputFilename);
    
    await fs.writeFile(outputFilepath, data, { encoding: "utf-8" });

    return outputFilepath;
  }
}

module.exports = ApplePasswordCsvExporter;
