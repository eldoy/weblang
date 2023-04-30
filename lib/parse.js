const _ = require('lodash')
const util = require('./util.js')

module.exports = function(statement, state, opt) {
  let [val, ...pipes] = statement.split('|').map(x => x.trim())

  let data = {}
  for (const pipe of pipes) {
    const [lang, body] = util.renderer(pipe)

    if (body) {
      data = body
      if (lang) {
        const renderer = opt.renderers[lang]
        if (typeof renderer == 'function') {
          data = renderer()
        }
      }
    } else {

      let [name, ...options] = pipe.split(' ').map(x => x.trim())

      const params = {}
      for (const opt of options) {
        let [key, val] = opt.split('=')
        val = util.get(val, state)
        params[key] = val
      }
      data[name] = params
    }
  }

  val = util.get(val, state)
  return [val, data]
}
