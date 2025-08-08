var extras = require('extras')
var get = require('./get.js')
var piper = require('./piper.js')

// Recursive builder
module.exports = async function build(obj, state, config, args) {
  for (var key in obj) {
    if (obj[key] && typeof obj[key] == 'object') {
      await build(obj[key], state, config, args)
    } else if (typeof obj[key] == 'string') {
      var [val, ...pipes] = obj[key].split('|').map((x) => x.trim())

      val = get(val, state)
      val = await piper(val, pipes, state, config, args)
      val = extras.transform(val)

      // Remove undefined
      if (typeof val == 'undefined') {
        delete obj[key]
      } else {
        obj[key] = val
      }
    }
  }
}
