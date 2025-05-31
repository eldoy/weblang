var { validate } = require('d8a')
var get = require('./get.js')

// Check if object validates
module.exports = async function ok(val, state) {
  for (var field in val) {
    var obj = val[field]
    var checks = get(field, state)
    if (checks && (await validate(obj, checks))) {
      return false
    }
  }
  return true
}
