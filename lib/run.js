function run(ast) {
  var state = {
    result: null,
    err: null,
    vars: {},
  }

  for (var node of ast) {
    var { key, value } = node

    var [assigns, func] = key.split('@')

    if (value.startsWith('$')) {
      var varName = value.slice(1)
      value = state.vars[varName]
    }

    if (assigns) {
      state.vars[assigns] = value
    }

    // Implement assign
    // Implement func
  }

  return { state }
}

module.exports = run
