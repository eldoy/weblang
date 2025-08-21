var d8a = require('d8a')

async function ok(val, state) {
  var result = await d8a.validate(val, state)
  return result === null
}

module.exports = ok
