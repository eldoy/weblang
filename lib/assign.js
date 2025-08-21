function assign(state, assigns, value) {
  var names = String(assigns)
    .split(',')
    .map(function (s) {
      return s.trim()
    })
    .filter(Boolean)

  if (names.length === 1) {
    state.vars[names[0]] = value
    return
  }

  if (Array.isArray(value)) {
    for (var i = 0; i < names.length; i++) {
      state.vars[names[i]] = value[i]
    }
  } else {
    for (var j = 0; j < names.length; j++) {
      state.vars[names[j]] = value
    }
  }
}

module.exports = assign
