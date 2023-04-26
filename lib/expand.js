const _ = require('lodash')
const { undot } = require('extras')

const build = require('./build.js')

module.exports = function(obj = {}, state = {}, opt = {}) {
  const wasString = typeof obj == 'string'
  if (wasString) obj = [obj]

  if (opt.undot !== false && _.isPlainObject(obj)) {
    obj = undot(_.cloneDeep(obj))
  }

  build(obj, state, opt)

  return wasString ? obj[0] : obj
}
