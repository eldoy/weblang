var lodash = require('lodash')

function get(state, key) {
  var data = lodash.get(state, key)
  return data
}

module.exports = get
