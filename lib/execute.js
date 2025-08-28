var assign = require('./assign.js')
var expand = require('./expand.js')
var ok = require('./ok.js')
var get = require('./get.js')
var set = require('./set.js')

async function execute(ast, node, state, opt = {}) {
  var { key, value } = node

  var data = expand(state, value)

  var { assigns, ext, bang } = node.operation
  var error
  if (ext) {
    var fn = opt.ext[ext]
    if (fn) {
      try {
        data = await fn.handler({
          ast,
          node,
          state,
          opt,
          data,
          ok,
          get,
          set,
        })
      } catch (e) {
        error = e.message
      }
    }
  }

  var [val, err] = assigns

  if (val && typeof data != 'undefined') {
    set(state.vars, val, data)
  }

  if (err && typeof error != 'undefined') {
    set(state.vars, err, error)
  }
}

module.exports = execute
