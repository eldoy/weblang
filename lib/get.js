var lodash = require('lodash')

function get(state, key) {
  var result = lodash.get(state.vars, key)
  return result
}

module.exports = get
