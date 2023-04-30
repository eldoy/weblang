const yaml = require('js-yaml')
const { cuid } = require('extras')

const identifier = new RegExp(`^\\s*[=@].*?:`, 'gm')

// Convert yaml string to javascript object
module.exports = function(code, opt = {}) {
  if (!code) return ''
  if (typeof code != 'string') return code

  // Replace tabs with spaces
  code = code.replace(/\t/g, '  ')

  // Add identifier to each variable and keyword node
  // Avoids duplicate key errors when re-using keys
  code = code.replace(identifier, m => {
    const keys = m.slice(0, -1).split('.')
    keys[0] += `#${cuid()}`
    return keys.join('.') + ':'
  })

  return yaml.load(code, { json: true })
}
