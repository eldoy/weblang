var parser = require('himalaya')

var execute = require('./execute.js')
var ext = require('./ext.js')

async function run(ast, opt = {}) {
  var state = {
    vars: { ...opt.vars },
    html: []
  }

  opt.ext = { ...ext, ...opt.ext }

  var last = ast.length - 1

  for (var i = 0; i < ast.length; i++) {
    var node = (state.root = ast[i])
    await execute(ast, node, state, opt)

    if (typeof state.return != 'undefined') {
      break
    }

    if (i === last && typeof state.return === 'undefined') {
      if (state.html.length) {
        state.return = parser.stringify(state.html)
      } else {
        state.return = state.last
      }
    }
  }

  return { state }
}

module.exports = run
