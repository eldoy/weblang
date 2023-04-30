const { transform } = require('extras')
const parse = require('./parse.js')

module.exports = function build(obj, state, opt) {
  for (const key in obj) {

    if (obj[key] && typeof obj[key] == 'object') {
      build(obj[key], state, opt)

    } else if (typeof obj[key] == 'string') {

      let [val, pipes] = parse(obj[key], state, opt)

      if (typeof pipes == 'string') {
        val = pipes
      } else {

        val = transform(val)

        // Apply pipes
        for (const name in pipes) {
          const pipe = (opt.pipes || {})[name]
          if (typeof pipe == 'function') {
            val = pipe(val, pipes[name])
          }
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