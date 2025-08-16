var shape = require('./shape.js')

function build(irt, callback = shape) {
  for (var key in irt) {
    irt[key] = callback(irt[key])
  }
  return irt
}

module.exports = build
