const yaml = require('js-yaml')

module.exports = function(code) {
  code = code.replace(/\t/g, '  ')
  return yaml.load(code, { json: true })
}
