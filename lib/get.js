let _ = require('lodash')

// Get state value
module.exports = function get(val, state) {
  if (val[0] == '$') {
    let name = val.slice(1)
    val = val[1] == '$' ? name : _.get(state.vars, name)
  }
  return val
}
