const get = require('./get.js')

// Apply pipes
module.exports = async function piper(val, pipes, state, config, args) {
  for (const pipe of pipes) {
    let [name, ...options] = pipe.split(' ').map((x) => x.trim())

    const params = {}
    for (const config of options) {
      let [key, val] = config.split('=')
      val = get(val, state)
      params[key] = val
    }

    const fn = (config.pipes || {})[name]
    if (typeof fn == 'function') {
      val = await fn({ ...args, params, val })
    }
  }
  return val
}
