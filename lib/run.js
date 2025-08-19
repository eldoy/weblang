function run(ast) {
  var state = {
    result: null,
    err: null,
    vars: {},
  }

  for (var node of ast) {
    if (!node) continue

    var { key, value } = node

    var isFunc = key.includes('@')

    if (!isFunc) {
      state.vars[key] = value
    }

    // Implement assign
    // Implement func
  }

  return { state }
}

module.exports = run
