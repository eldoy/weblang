const yaml = require('js-yaml')
const { cuid } = require('extras')

const keywords = ['\\$', 'if', 'then', 'else', 'return']

// Convert yaml string to javascript object
module.exports = function(code, opt = {}) {
  if (!code) return ''

  code = code.replace(/\t/g, '  ')

  const words = keywords.concat(Object.keys(opt.ext || {}))
  const identifier = new RegExp(`^\\s*(${words.join('|')}).*?:`, 'gm')

  // Add identifier to each variable and keyword node
  // Avoids duplicate key errors when re-using keys
  code = code.replace(identifier, m => {
    const keys = m.slice(0, -1).split('.')
    keys[0] += `#${cuid()}`
    return keys.join('.') + ':'
  })

  return yaml.load(code, { json: true })
}
