const yaml = require('js-yaml')

const util = {}

util.yaml = yaml

// Extract setter, name and id
util.split = function(leaf) {
  let [name, rest = ''] = leaf.split('#')
  let [id, ...chain] = rest.split('.')
  name = [name].concat(chain).join('.')
  return [name, id]
}

module.exports = util
