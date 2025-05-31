var ext = require('./lib/ext.js')
var pipes = require('./lib/pipes.js')
var execute = require('./lib/execute.js')

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
