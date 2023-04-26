const yaml = require('js-yaml')

const util = {}

util.yaml = yaml

// Extract id and name
util.split = function(str) {
  let [name, rest = ''] = str.split('#')
  let [id, ...chain] = rest.split('.')
  name = [name].concat(chain).join('.')
  return [name, id]
}

// Parse pipe options
util.parsePipes = function(pipes) {
  const result = {}
  for (const pipe of pipes) {
    let [name, options = ''] = pipe.split(' ').map(x => x.trim())
    options = options.split('&').map(x => x.trim())
    const params = {}
    for (const opt of options) {
      const [key, val] = opt.split('=')
      params[key] = val
    }
    result[name] = params
  }
  return result
}

module.exports = util
