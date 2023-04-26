const _ = require('lodash')
const { undot, transform } = require('extras')
const util = require('./util.js')

module.exports = function(obj = {}, state = {}, opt = {}) {

  const wasString = typeof obj == 'string'
  if (wasString) obj = [obj]

  if (opt.undot !== false && _.isPlainObject(obj)) {
    obj = undot(_.cloneDeep(obj))
  }

  function expand(obj) {
    for (const key in obj) {

      if (obj[key] && typeof obj[key] == 'object') {
        expand(obj[key])

      } else if (typeof obj[key] == 'string') {

        let [val, ...pipes] = obj[key].split('|').map(x => x.trim())

        // Replace with var
        if (val[0] == '$') {
          const name = val.slice(1)
          val = val[1] == '$' ? name : _.get(state.vars || {}, name)
        }

        val = transform(val)

        pipes = util.parsePipes(pipes)

        // Apply pipes
        for (const name in pipes) {
          const pipe = (opt.pipes || {})[name]
          if (typeof pipe == 'function') {
            val = pipe(val, pipes[name])
          }
        }

        // Remove undefined
        if (typeof val == 'undefined') {
          delete obj[key]
        } else {
          obj[key] = val
        }
      }
    }
  }

  expand(obj)

  return wasString ? obj[0] : obj
}
