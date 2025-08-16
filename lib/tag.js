var matcher = /(\s*)([-]?\s*[=@][^:\s]+)(:)/g

module.exports = function tag(code, number, block) {
  var hit = 1

  return code.replace(matcher, function (_, space, key, colon) {
    var flag = key.startsWith('-') ? 'a' : 's'
    var cleanKey = key.replace(/^\s*-\s*/, '')
    var id = `_ID_${flag}-${block}-${number}-${hit++}_ID_`

    return space + cleanKey + id + colon
  })
}
