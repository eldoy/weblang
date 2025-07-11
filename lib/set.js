var lodash = require('lodash')
var { transform, dot, undot, type } = require('extras')

var clean = function (data, ...types) {
  function match(val) {
    return (
      (types.length === 0 && val === undefined) || types.includes(type(val))
    )
  }

  function build(obj) {
    for (var key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        build(obj[key])
      } else if (match(obj[key])) {
        if (Array.isArray(obj)) {
          obj.splice(key, 1)
        } else {
          delete obj[key]
        }
      }
    }
  }

  build(data)
  return data
}

// Set state value
module.exports = function set(key, val, state) {
  if (key[0] == '=') key = key.slice(1)
  var dotted = dot({ [key]: lodash.cloneDeep(val) })
  for (var k in dotted) {
    lodash.set(state.vars, k, dotted[k])
  }
  state.vars = clean(state.vars)
}
