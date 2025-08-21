var column = require('./column.js')

var matcher = /(\s*)([-]?\s*[=@][^:\s]+)(:)/g

module.exports = function tag(code, number, block) {
  var col = 0

  return code.replace(matcher, function (_, space, key, colon) {
    var flag = key.startsWith('-') ? 'a' : 's'
    var cleanKey = key.replace(/^\s*-\s*/, '')

    col = column(code, col)

    var id = `_ID_${flag}-${block}-${number}-${col}_ID_`

    return space + cleanKey + id + colon
  })
}
