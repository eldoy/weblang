let { validate } = require('d8a')
let get = require('./get.js')

// Check if object validates
module.exports = async function ok(val, state) {
  for (let field in val) {
    let obj = val[field]
    let checks = get(field, state)
    if (checks && (await validate(obj, checks))) {
      return false
    }
  }
  return true
}
