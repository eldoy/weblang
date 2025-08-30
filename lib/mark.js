var column = require('./column.js')

var matcher = /(\s*)([-]?\s*[=@][^:\s]+)(:)/g

module.exports = function tag(code, block, line) {
  var col = 0
  var hit = 1

  return code.replace(matcher, function (_, space, key, colon) {
    var flag = key.startsWith('-') ? 'a' : 's'

    key = key.replace(/^\s*-\s*/, '')
    col = column(code, col)

    var id = `_ID_${flag}-${block}-${line}-${col}-${hit++}_ID_`

    return space + key + id + colon
  })
}
