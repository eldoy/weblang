var lodash = require('lodash')

function get(state, key) {
  var data = lodash.get(state.vars, key)
  return data
}

module.exports = get
