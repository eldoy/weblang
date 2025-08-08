var yaml = require('js-yaml')

module.exports = function parse(code) {
  return yaml.load(code, { json: true })
}
