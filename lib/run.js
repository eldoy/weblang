function run(ast) {
  var state = {
    result: null,
    err: null,
  }

  for (var node of ast) {
    if (!node) continue

    var { key, value } = node

    if (key) {
      state[key] = value
    }

    // Implement assign
    // Implement func
  }

  return { state }
}

module.exports = run
