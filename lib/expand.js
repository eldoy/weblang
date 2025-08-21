function expand(state, value) {
  if (value == null) return value

  if (typeof value === 'string' && value[0] === '$') {
    var key = value.slice(1)
    return state && state.vars ? state.vars[key] : undefined
  }

  if (Array.isArray(value)) {
    var changed = false
    var out = value.map((v) => {
      var nv = expand(state, v)
      if (nv !== v) changed = true
      return nv
    })
    return changed ? out : value
  }

  if (typeof value === 'object') {
    var changed = false
    var out = {}
    for (var [k, v] of Object.entries(value)) {
      var nk = k
      if (k[0] === '$') {
        var key = k.slice(1)
        nk = state && state.vars ? state.vars[key] : undefined
      }
      var nv = expand(state, v)
      if (nk !== k || nv !== v) changed = true
      out[nk] = nv
    }
    return changed ? out : value
  }

  return value
}

module.exports = expand
