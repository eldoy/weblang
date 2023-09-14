const ext = require('./lib/ext.js')
const pipes = require('./lib/pipes.js')
const execute = require('./lib/execute.js')

// Init weblang runner
function init(config = {}) {
  config.pipes = { ...pipes, ...config.pipes }
  config.ext = { ...ext, ...config.ext }

  return {
    run: function (code) {
      return execute(code, config)
    }
  }
}

module.exports = { init }
