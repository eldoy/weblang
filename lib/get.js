var lodash = require('lodash')

function get(state, key) {
  var result = lodash.get(state, key)
  return result
}

module.exports = get
