const _ = require('lodash')
const { transform } = require('extras')
const util = require('./util.js')

module.exports = function build(obj, state, opt) {
  for (const key in obj) {

    if (obj[key] && typeof obj[key] == 'object') {
      build(obj[key], state, opt)

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