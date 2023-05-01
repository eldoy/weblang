const _ = require('lodash')
const { transform, undot } = require('extras')
const util = require('./util.js')

module.exports = function (obj = {}, state = {}, opt = {}) {
  const wasString = typeof obj == 'string'
  if (wasString) obj = [obj]

  if (opt.undot !== false && _.isPlainObject(obj)) {
    obj = undot(_.cloneDeep(obj))
  }

  function build(obj, state, opt) {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] == 'object') {
        build(obj[key], state, opt)
      } else if (typeof obj[key] == 'string') {
        let statement = obj[key]

        let [val, ...pipes] = statement.split('|').map((x) => x.trim())

        let data = {}
        for (const pipe of pipes) {
          const [lang, body] = util.renderer(pipe)

          if (body) {
            data = body
            if (lang) {
              const renderer = opt.renderers[lang]
              if (typeof renderer == 'function') {
                // TODO: Async + pass args
                data = renderer()
              }
            }
          } else {
            let [name, ...options] = pipe.split(' ').map((x) => x.trim())

            const params = {}
            for (const opt of options) {
              let [key, val] = opt.split('=')
              val = util.get(val, state)
              params[key] = val
            }
            data[name] = params
          }
        }
        pipes = data

        val = util.get(val, state)

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

  build(obj, state, opt)

  return wasString ? obj[0] : obj
}
