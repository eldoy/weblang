let _ = require('lodash')
let { transform, dot, undot, clean } = require('extras')

// Set state value
module.exports = function set(key, val, state) {
  if (key[0] == '=') key = key.slice(1)
  let dotted = dot({ [key]: _.cloneDeep(val) })
  for (let k in dotted) {
    _.set(state.vars, k, dotted[k])
  }
  state.vars = clean(state.vars)
}
