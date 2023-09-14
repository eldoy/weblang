let _ = require('lodash')
let { undot } = require('extras')
let build = require('./build.js')

// Expand dot and initiate build
module.exports = async function expand(obj = {}, state = {}, config = {}, args = {}) {
  let wasString = typeof obj == 'string'
  if (wasString) obj = [obj]
  if (_.isPlainObject(obj)) {
    obj = undot(_.cloneDeep(obj))
  }
  await build(obj, state, config, args)

  return wasString ? obj[0] : obj
}
