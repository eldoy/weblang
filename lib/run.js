var execute = require('./execute.js')

async function run(ast, opt = {}) {
  var state = {
    vars: { ...opt.vars },
  }

  opt.ext ||= {}
  opt.pipes ||= {}

  for (var node of ast) {
    var [val, err] = await execute(ast, node, state, opt)
    if (err != null) {
      state.err =
        'error on line ' + node.line + ' column ' + node.column + ': ' + err
      break
    }
  }

  return { state }
}

module.exports = run
