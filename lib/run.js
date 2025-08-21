var assign = require('./assign.js')
var expand = require('./expand.js')

async function run(ast, opt = {}) {
  var state = {
    vars: opt.vars || {},
  }

  var { ext = {} } = opt

  for (var node of ast) {
    var { key, value } = node

    var [assigns, func] = key.split('@')

    var val = expand(state, value)

    var message
    if (func) {
      var fn = ext[func]
      if (fn) {
        try {
          val = await fn.handler(ast, node)
          if (typeof val != 'undefined') {
            state.result = val
          }
        } catch (e) {
          message = e.message
        }
      } else {
        message = 'the function "' + func + '" does not exist'
      }
    }

    if (message) {
      state.err = `error on line ${node.line} column ${node.column}: ${message}`
      return { state }
    }

    if (assigns) {
      assign(state, assigns, val)
    }
  }

  return { state }
}

module.exports = run
