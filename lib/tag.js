var identifier = /(\s*)([=@][^:\s]+)(:)/g

module.exports = function tag(code, number, block) {
  var occurrence = 1
  return code.replace(identifier, (_, space, key, colon) => {
    var id = `_ID_${block}-${number}-${occurrence++}_ID_`
    return space + key + id + colon
  })
}
