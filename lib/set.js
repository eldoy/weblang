var lodash = require('lodash')

function set(state, key, value) {
  lodash.set(state.vars, key, value)
}

module.exports = set
