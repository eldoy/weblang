var { cuid } = require('extras')
var identifier = /^\s*[=@].*?:/gm

module.exports = function tag(code) {
  return code.replace(identifier, (m) => {
    var keys = m.slice(0, -1).split('.')
    keys[0] += `#${cuid()}`
    return keys.join('.') + ':'
  })
}
