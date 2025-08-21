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

    value = expand(state, value)
    node.value = value

    var message
    if (func) {
      var fn = ext[func]
      if (fn) {
        try {
          value = await fn.handler(ast, node)
          if (typeof value != 'undefined') {
            state.result = value
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
      assign(state, assigns, value)
    }
  }

  return { state }
}

module.exports = run
