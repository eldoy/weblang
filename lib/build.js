var shape = require('./shape.js')

function build(irt, callback = shape) {
  var ast = []
  for (var key in irt) {
    var node = callback({ [key]: irt[key] })
    ast.push(node)
  }
  return ast
}

module.exports = build
