var execute = require('./execute.js')

async function run(ast, opt = {}) {
  var state = {
    vars: { ...opt.vars },
  }

  opt.ext ||= {}

  for (var node of ast) {
    await execute(ast, node, state, opt)
    if (typeof state.return != 'undefined') {
      break
    }
  }

  return { state }
}

module.exports = run
