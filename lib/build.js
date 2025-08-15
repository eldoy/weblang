function build(node, callback) {
  var result = null

  for (var key of Object.keys(node)) {
    var shaped = callback(key, node[key])
    if (!result) result = shaped
  }

  return result
}

module.exports = build
