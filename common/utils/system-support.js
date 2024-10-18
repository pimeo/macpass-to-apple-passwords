const { test_command } = require("./exec");
const semver = require("semver");
const os = require("node:os");

//
// @TODO (v2 of commands supports detection )
// - define priorites of command to be enable to work (and eventually group them by a command group)
// - add custom unsupported message installation by os platform
// - manage missing dependencies
// const toto = {
//   'git': {
//     unsupported_message: 'Please install dpkg on your machine',
//   },
//   // reserved word
//   groups: [
//     {
//       'build': {
//         'dpkg': {
//           unsupported_message: 'Please install dpkg on your machine',
//           unsupported_message_linux: 'Please install dpkg on your machine or use chrooting your ubuntu/debian system.',
//           unsupported_message_darwin: 'Please install dpkg on your machine via: brew install dpkg',
//           os: ['linux', 'darwin'],
//           priority: 1,
//           dependencies: {
//             darwin: ['homebrew']
//           }
//         },
//         'debuild': {
//           unsupported_message: 'Please install debuild on your machine via: sudo apt-get install devscripts build-essential lintian',
//           os: ['linux'],
//           priority: 5
//         },
//         'fpm': {
//           unsupported_message: 'Please install fpm on your machine',
//           unsupported_message_linux: 'Please install fpm on your machine via: sudo apt-get install ruby ruby-dev rubygems build-essential',
//           unsupported_message_darwin: 'Please install fpm on your machine via: brew install gnu-tar',
//           os: ['linux', 'darwin'],
//           priority: 10
//         }
//       }
//     }
//   ],
//   dependencies: {
//     homebrew: {
//       unsupported_message: 'Please install brew via: /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"',
//       os: ['darwin']
//     }
//   }
// }
//
// and them keep using is_supported(toto, 'git') or using is_supported(toto, 'build')
//

module.exports.detectCommandsSupports = (commands = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const keys = Object.keys(commands);
      for (const iterator of keys) {
        // override command with default values
        commands[iterator] = Object.assign(
          {},
          {
            is_supported: false, // not supported by default
            version: null, // final version if detected
            satisfies_version: null, // version condition
            os: [], // os platform condition
            required: true // return throw error if required
          },
          commands[iterator]
        );
        const command = commands[iterator];

        // os validation from current os platform
        if (command.os.length) {
          const current_platform = os.platform();
          const is_os_supported = command.os.some((o) => current_platform.indexOf(o) != -1);
          if (!is_os_supported) {
            command.is_supported = "indeterminated";
            continue;
          }
        }

        // asked for command support
        // If supported, can return true or the version string
        // It not supported, must return false
        const response = await test_command(
          command.command || iterator,
          command.inject_defaults_unsupported_patterns || true,
          command.unsupported_patterns || []
        );

        // boolean case
        if (typeof response == "boolean") {
          command.is_supported = response;
        }
        // string case (version string)
        else if (typeof response == "string") {
          command.version = response;

          // check if user ask for a precise version
          if (command.satisfies_version) {
            command.is_supported = semver.satisfies(response, command.satisfies_version);
            // else it is supported
          } else {
            command.is_supported = true;
          }
        }

        // throw an error if command is required
        if (command.required && command.is_supported == false) {
          return reject(command.unsupported_message_darwin);
        }
      }
      return resolve(commands);
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports.isCommandSupported = (object = {}, command) => {
  if (!object[command]) {
    return false;
  }
  return object[command].is_supported || false;
};
