const yaml = require('js-yaml')

// Convert yaml string to javascript object
function load(code) {
  if (!code) return ''
  code = code.replace(/\t/g, '  ')
  return yaml.load(code, { json: true })
}

module.exports = { load }
