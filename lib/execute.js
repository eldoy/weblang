var assign = require('./assign.js')
var expand = require('./expand.js')
var ok = require('./ok.js')
var get = require('./get.js')
var set = require('./set.js')

async function execute(ast, node, state, opt = {}) {
  var { key, value } = node

  var [assigns, func] = key.split('@')

  var val = expand(state, value)

  var message
  if (func) {
    var fn = opt.ext[func]
    if (fn) {
      try {
        val = await fn.handler({
          ast,
          node,
          state,
          opt,
          val,
          ok,
          get,
          set,
        })
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
    return
  }

  if (assigns) {
    assign(state, assigns, val)
  }
}

module.exports = execute
