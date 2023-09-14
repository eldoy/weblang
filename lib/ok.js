const { validate } = require('d8a')
const get = require('./get.js')

// Check if object validates
module.exports = async function ok(val, state) {
  for (const field in val) {
    const obj = val[field]
    const checks = get(field, state)
    if (checks && (await validate(obj, checks))) {
      return false
    }
  }
  return true
}
