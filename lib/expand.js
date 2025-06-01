var lodash = require('lodash')
var { undot } = require('extras')
var build = require('./build.js')

// Expand dot and initiate build
module.exports = async function expand(
  obj = {},
  state = {},
  config = {},
  args = {}
) {
  var wasString = typeof obj == 'string'
  if (wasString) obj = [obj]
  if (lodash.isPlainObject(obj)) {
    obj = undot(lodash.cloneDeep(obj))
  }
  await build(obj, state, config, args)

  return wasString ? obj[0] : obj
}
