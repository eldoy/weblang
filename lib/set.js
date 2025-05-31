var _ = require('lodash')
var { transform, dot, undot, clean } = require('extras')

// Set state value
module.exports = function set(key, val, state) {
  if (key[0] == '=') key = key.slice(1)
  var dotted = dot({ [key]: _.cloneDeep(val) })
  for (var k in dotted) {
    _.set(state.vars, k, dotted[k])
  }
  state.vars = clean(state.vars)
}
