var lodash = require('lodash')

function set(state, key, value) {
  lodash.set(state, key, value)
}

module.exports = set
