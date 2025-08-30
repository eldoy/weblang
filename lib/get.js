var lodash = require('lodash')

function get(state, key) {
  return lodash.get(state.vars, key)
}

module.exports = get
