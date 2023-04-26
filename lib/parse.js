const _ = require('lodash')
const { transform } = require('extras')

module.exports = function(statement, state, opt) {
  let [val, ...pipes] = statement.split('|').map(x => x.trim())
  const data = {}
  for (const pipe of pipes) {
    let [name, options = ''] = pipe.split(' ').map(x => x.trim())
    options = options.split('&').map(x => x.trim())
    const params = {}
    for (const opt of options) {
      const [key, val] = opt.split('=')
      params[key] = val
    }
    data[name] = params
  }
  return [val, data]
}
