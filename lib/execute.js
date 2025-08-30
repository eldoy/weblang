var expand = require('./expand.js')
var ok = require('./ok.js')
var get = require('./get.js')
var set = require('./set.js')

async function execute(ast, node, state, opt = {}) {
  var { key, value, children = [] } = node

  var data = expand(state, value)

  var { assigns, ext, bang } = node.operation
  var error
  if (ext) {
    var fn = opt.ext[ext]
    if (fn) {
      try {
        state.last = data = await fn.handler({
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
    set(state, val, data)
  }

  if (err && typeof error != 'undefined') {
    set(state, err, error)
  }

  if (typeof state.return != 'undefined') {
    return
  }

  if (state.break) {
    delete state.break
    return
  }

  if (!children.length) {
    return
  }

  var it = state.iterator
  if (Array.isArray(it) && it.length) {
    delete state.iterator
    for (var i = 0; i < it.length; i++) {
      state.vars[state.as] = it[i]
      state.vars[state.n] = i
      for (var child of children) {
        await execute(ast, child, state, opt)
      }
    }
  } else {
    for (var child of children) {
      await execute(ast, child, state, opt)
    }
  }
}

module.exports = execute
