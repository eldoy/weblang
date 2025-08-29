var lodash = require('lodash')

function set(state, key, data) {
  lodash.set(state.vars, key, data)
}

module.exports = set
