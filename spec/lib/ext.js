var ext = {}

ext.db = function ({ set }) {
  set('=internal', 'hello')

  return [{ id: '1' }, null]
}

ext.sum = function ({ get, current }) {
  if (!current.a) return [null, "Missing arg: 'a'"]
  if (!current.b) return [null, "Missing arg: 'b'"]

  var a = get(current.a)
  var b = get(current.b)

  return [a + b, null]
}

ext.log = function ({ get, current }) {
  console.log(get(current))
}

module.exports = ext
