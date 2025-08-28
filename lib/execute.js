var assign = require('./assign.js')
var expand = require('./expand.js')
var ok = require('./ok.js')
var get = require('./get.js')
var set = require('./set.js')

async function execute(ast, node, state, opt = {}) {
  var { key, value } = node

  var [assigns, func] = key.split('@')

  var val = expand(state, value)

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
      } catch (e) {
        return [null, e.message]
      }
    } else {
      return [null, 'the function "' + func + '" does not exist']
    }
  }

  if (assigns) {
    assign(state, assigns, val)
  }

  return [val ?? null, null]
}

module.exports = execute
