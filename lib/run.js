var execute = require('./execute.js')
var ext = require('./ext.js')

async function run(ast, opt = {}) {
  var state = {
    vars: { ...opt.vars },
  }

  opt.ext = { ...ext, ...opt.ext }

  var last = ast.length - 1

  for (var i = 0; i < ast.length; i++) {
    var node = ast[i]
    await execute(ast, node, state, opt)
    if (typeof state.return != 'undefined') {
      break
    }
    if (i == last && typeof state.return == 'undefined') {
      state.return = state.last
    }
  }

  return { state }
}

module.exports = run
