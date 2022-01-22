const _ = require('lodash')
const { undot } = require('./util.js')

module.exports = function expand(obj, state) {

  const string = typeof obj == 'string'
  if (string) obj = [obj]

  if (_.isPlainObject(obj)) obj = undot(obj)

  function walk(obj) {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] == 'object') {
        walk(obj[key])
      } else if (typeof obj[key] == 'string') {
        // TODO: convert strings to numbers if using pipe?
        if (obj[key][0] == '$') {
          const k = obj[key].slice(1)
          const v = _.get(state.vars, k)
          obj[key] = v
        }
      }
    }
  }

  walk(obj)

  if (string) obj = obj[0]

  return obj
}
