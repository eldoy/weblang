var lodash = require('lodash')

function get(state, key, node) {
  if (node) {
    var sid = node.scopeid
    if (
      sid != null &&
      state.locals &&
      state.locals[sid] &&
      lodash.has(state.locals[sid], key)
    ) {
      return lodash.get(state.locals[sid], key)
    }

    for (var p = node.parent; p; p = p.parent) {
      var pid = p.scopeid
      if (
        pid != null &&
        state.locals &&
        state.locals[pid] &&
        lodash.has(state.locals[pid], key)
      ) {
        return lodash.get(state.locals[pid], key)
      }
    }
  }

  return lodash.get(state.vars, key)
}

module.exports = get
