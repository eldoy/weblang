var lodash = require('lodash')

function set(state, key, data) {
  lodash.set(state, key, data)
}

module.exports = set
