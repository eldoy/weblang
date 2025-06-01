var lodash = require('lodash')
var { transform, dot, undot, clean } = require('extras')

// Set state value
module.exports = function set(key, val, state) {
  if (key[0] == '=') key = key.slice(1)
  var dotted = dot({ [key]: lodash.cloneDeep(val) })
  for (var k in dotted) {
    lodash.set(state.vars, k, dotted[k])
  }
  state.vars = clean(state.vars)
}
