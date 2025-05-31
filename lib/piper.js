var get = require('./get.js')

// Apply pipes
module.exports = async function piper(val, pipes, state, config, args) {
  for (var pipe of pipes) {
    var [name, ...options] = pipe.split(' ').map((x) => x.trim())

    var params = {}
    for (var pair of options) {
      var [k, v] = pair.split('=')
      v = get(v, state)
      params[k] = v
    }

    var fn = (config.pipes || {})[name]
    if (typeof fn == 'function') {
      val = await fn({ ...args, params, val })
    }
  }
  return val
}
