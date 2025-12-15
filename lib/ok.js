var d8a = require('d8a')
var lodash = require('lodash')

async function ok(data, state) {
  if (!lodash.isPlainObject(data)) {
    if (typeof data === 'string' && data[0] === '$') {
      data = lodash.get(state.vars, data.slice(1))
    }
    return !!data
  }

  var checks = {}

  for (var key in data) {
    var val = data[key]

    if (key[0] === '$') {
      key = key.slice(1)
    }

    checks[key] = val
  }

  var result = await d8a.validate(checks, state.vars)
  return result == null
}

module.exports = ok
