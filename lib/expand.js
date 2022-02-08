const _ = require('lodash')
const { undot, transform } = require('extras')
const pipes = require('./pipes.js')

module.exports = function expand(obj = {}, state = {}, opt = {}) {

  opt.pipes = { ...pipes, ...opt.pipes }

  const wasString = typeof obj == 'string'
  if (wasString) obj = [obj]

  if (opt.undot !== false && _.isPlainObject(obj)) {
    obj = undot(_.cloneDeep(obj))
  }

  function walk(obj) {
    for (const key in obj) {

      if (obj[key] && typeof obj[key] == 'object') {
        walk(obj[key])

      } else if (typeof obj[key] == 'string') {

        let [val, ...pipes] = obj[key].split('|').map(x => x.trim())

        // Replace with var
        if (val[0] == '$') {
          const name = val.slice(1)
          val = val[1] == '$' ? name : _.get(state.vars || {}, name)
        }

        val = transform(val)

        // Apply pipes
        for (const p of pipes) {
          const pipe = (opt.pipes || {})[p]
          if (typeof pipe == 'function') {
            val = pipe(val)
          }
        }

        if (typeof val == 'undefined') {
          delete obj[key]
        } else {
          obj[key] = val
        }
      }
    }
  }

  walk(obj)

  return wasString ? obj[0] : obj
}
