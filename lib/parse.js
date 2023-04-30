const _ = require('lodash')

module.exports = function(statement, state) {
  let [val, ...pipes] = statement.split('|').map(x => x.trim())
  const data = {}
  for (const pipe of pipes) {
    let [name, ...options] = pipe.split(' ').map(x => x.trim())
    const params = {}
    for (const opt of options) {
      let [key, val] = opt.split('=')

      // Replace with var
      if (val[0] == '$') {
        const name = val.slice(1)
        val = val[1] == '$' ? name : _.get(state.vars, name)
      }
      params[key] = val
    }
    data[name] = params
  }
  return [val, data]
}
