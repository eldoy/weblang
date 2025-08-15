var build = require('../../lib/build.js')

test('correct order', async ({ t }) => {
  var code = {
    a: { a1: 1, a2: 2 },
    b: { b1: { b11: 11 } },
    c: [{ c1: 10 }, { c2: 20 }],
    d: 3,
  }

  var keysVisited = []

  build(code, (key) => {
    keysVisited.push(key)
  })

  t.equal(keysVisited[0], 'a')
  t.equal(keysVisited[1], 'a1')
  t.equal(keysVisited[2], 'a2')
  t.equal(keysVisited[3], 'b')
  t.equal(keysVisited[4], 'b1')
  t.equal(keysVisited[5], 'b11')
  t.equal(keysVisited[6], 'c')
  t.equal(keysVisited[7], 'c1')
  t.equal(keysVisited[8], 'c2')
  t.equal(keysVisited[9], 'd')
})

test('assign', async ({ t }) => {
  var irt = { '=hello_ID_s-1-1-1_ID_': 'user' }
  var result = build(irt)

  t.equal(result.id, 's-1-1-1')
  t.equal(result.key, 'hello')
  t.equal(result.value, 'user')
})

test('assign children', async ({ t }) => {
  var irt = { '@p_ID_s-1-1-1_ID_': { '@p_ID_s-1-1-2_ID_': 'a' } }
  var result = build(irt)

  t.equal(result.id, 's-1-1-1')
  t.equal(result.key, '@p')
  t.equal(result.children[0].key, '@p')
  t.equal(result.children[0].id, 's-1-1-2')
  t.equal(result.children[0].value, 'a')
})
