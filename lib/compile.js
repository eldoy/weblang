let yaml = require('js-yaml')
let tag = require('./tag.js')

// Convert yaml string to javascript object
module.exports = function compile(code) {
  if (!code) return ''
  if (typeof code != 'string') return code

  // Replace tabs with spaces
  code = code.replace(/\t/g, '  ')

  // Add identifier to each variable and keyword node
  // Avoids duplicate key errors when re-using keys
  code = tag(code)

  return yaml.load(code, { json: true })
}
