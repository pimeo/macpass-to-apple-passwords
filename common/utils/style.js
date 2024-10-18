module.exports.welcomeMessage = (options = {}) => {

  options = Object.assign({}, {
    cli_version: 'undefined',
    env: 'unknown',
    debug: false,
    silent: false,
  }, options)

  // build logo
  // http://patorjk.com/software/taag/#p=display&f=Big&t=ProHacktive
  const logo = [
    ``,
    `______          _   _            _    _   _           `,
    `
     ██████ ██    ██ ██████  ██ ███████  ██████  ██████  ██    ██ ███████ ██████  
    ██       ██  ██  ██   ██ ██ ██      ██      ██    ██ ██    ██ ██      ██   ██ 
    ██        ████   ██   ██ ██ ███████ ██      ██    ██ ██    ██ █████   ██████  
    ██         ██    ██   ██ ██      ██ ██      ██    ██  ██  ██  ██      ██   ██ 
     ██████    ██    ██████  ██ ███████  ██████  ██████    ████   ███████ ██   ██`,
    ``,
  ]

  // dynamic array of configurations
  const metadata = []
  // cli version
  if (options.cli_version) { metadata.push(`CLI Version: ${options.cli_version}`) }
  if (options.env) { metadata.push(`Environment: ${options.env}`) }
  if (options.debug) { metadata.push(`Debug Mode: Enabled`) }
  if (options.silent) { metadata.push(`Silent Mode: Enabled`) }

  // extra static data
  const extra = [
    ``,
    `Need help using node? Run command node index.js --help`,
    `Need help using npm (development)? Run command npm run cli-dev -- --help`,
    `Need help using npm (production)? Run command npm run cli -- --help`,
    `------------------------------------------------------`,
    ``
  ]

  // console log everything
  console.log(logo.join('\n'))
  console.log(metadata.join('\n'))
  console.log(extra.join('\n'))
}
