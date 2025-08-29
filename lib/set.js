var lodash = require('lodash')

function set(state, key, data, node) {
  if (!node || lodash.has(state.vars, key)) {
    return lodash.set(state.vars, key, data)
  }

  for (var p = node.parent; p; p = p.parent) {
    var pid = p.scopeid
    if (
      pid != null &&
      state.locals[pid] &&
      lodash.has(state.locals[pid], key)
    ) {
      return lodash.set(state.locals[pid], key, data)
    }
  }

  var sid = node.scopeid
  if (state.locals[sid] && lodash.has(state.locals[sid], key)) {
    return lodash.set(state.locals[sid], key, data)
  }

  if (!state.locals[sid]) {
    state.locals[sid] = {}
  }

  lodash.set(state.locals[sid], key, data)
}

module.exports = set
