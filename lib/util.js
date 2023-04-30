const yaml = require('js-yaml')

const matcher = /#([a-z0-9]{24})/

const util = {}

util.yaml = yaml

// Extract setter, name and id
util.split = function(str) {
  let id = ''
  const match = str.match(matcher)
  if (match) {
    str = str.replace(match[0], '')
    id = match[1]
  }
  const [key, ext = ''] = str.trim().split('@')
  return [key, ext, id]
}

module.exports = util
