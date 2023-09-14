let { transform } = require('extras')
let get = require('./get.js')
let piper = require('./piper.js')

// Recursive builder
module.exports = async function build(obj, state, config, args) {
  for (let key in obj) {
    if (obj[key] && typeof obj[key] == 'object') {
      await build(obj[key], state, config, args)
    } else if (typeof obj[key] == 'string') {
      let [val, ...pipes] = obj[key].split('|').map((x) => x.trim())

      val = get(val, state)
      val = await piper(val, pipes, state, config, args)
      val = transform(val)

      // Remove undefined
      if (typeof val == 'undefined') {
        delete obj[key]
      } else {
        obj[key] = val
      }
    }
  }
}
