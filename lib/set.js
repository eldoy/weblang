var lodash = require('lodash')

function set(state, key, data) {
  return lodash.set(state.vars, key, data)
}

module.exports = set
