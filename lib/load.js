const yaml = require('js-yaml')

// Convert yaml string to javascript object
module.exports = function(code) {
  if (!code) return ''
  code = code.replace(/\t/g, '  ')
  return yaml.load(code, { json: true })
}
