var execute = require('./execute.js')

async function run(ast, opt = {}) {
  var state = {
    vars: { ...opt.vars },
  }

  opt.ext ||= {}
  opt.pipes ||= {}

  for (var node of ast) {
    await execute(ast, node, state, opt)
  }

  return { state }
}

module.exports = run
