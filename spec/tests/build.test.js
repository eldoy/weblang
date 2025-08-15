var build = require('../../lib/build.js')

test('returns root keys in order', ({ t }) => {
  var obj = { a: 1, b: 2, c: 3 }
  var keysVisited = []

  build(obj, (key, value) => {
    keysVisited.push(key)
  })

  t.equal(keysVisited[0], 'a')
  t.equal(keysVisited[1], 'b')
  t.equal(keysVisited[2], 'c')
})

test('returns only first node', ({ t }) => {
  var obj = { a: 1, b: 2, c: 3 }
  var result = build(obj, (key, value) => ({ key, value }))

  t.equal(result.key, 'a')
  t.equal(result.value, 1)
})
