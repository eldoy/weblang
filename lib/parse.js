const _ = require('lodash')
const util = require('./util.js')

module.exports = function(statement, state) {
  let [val, ...pipes] = statement.split('|').map(x => x.trim())

  const data = {}
  for (const pipe of pipes) {
    let [name, ...options] = pipe.split(' ').map(x => x.trim())

    const params = {}
    for (const opt of options) {
      let [key, val] = opt.split('=')
      val = util.get(val, state)
      params[key] = val
    }
    data[name] = params
  }

  val = util.get(val, state)
  return [val, data]
}
