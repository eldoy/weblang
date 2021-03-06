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

module.exports = util