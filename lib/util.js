const _ = require('lodash')
const yaml = require('js-yaml')

const regexp = {
  id: /#([a-z0-9]{24})/,
  render: /```([a-z0-9]*)?(.*)```/
}

const util = {}

util.yaml = yaml

util.get = function(val, state) {
  if (val[0] == '$') {
    const name = val.slice(1)
    val = val[1] == '$' ? name : _.get(state.vars, name)
  }
  return val
}


// Extract setter, name and id
util.split = function(str) {
  let id = ''
  const match = str.match(regexp.id)
  if (match) {
    str = str.replace(match[0], '')
    id = match[1]
  }
  const [key, ext = ''] = str.trim().split('@')
  return [key, ext, id]
}

module.exports = util
