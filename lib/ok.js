var d8a = require('d8a')

async function ok(schema, state) {
  var checks = {}

  for (var key in schema) {
    var val = schema[key]
    if (key[0] == '$') {
      key = key.slice(1)
    }
    checks[key] = val
  }

  var result = await d8a.validate(checks, state.vars)
  return result == null
}

module.exports = ok
