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

  // Test expected DFS post-order:
  t.equal(keysVisited[0], 'a1')
  t.equal(keysVisited[1], 'a2')
  t.equal(keysVisited[2], 'a')
  t.equal(keysVisited[3], 'b11')
  t.equal(keysVisited[4], 'b1')
  t.equal(keysVisited[5], 'b')
  t.equal(keysVisited[6], 'c1')
  t.equal(keysVisited[7], 'c2')
  t.equal(keysVisited[8], 'c')
  t.equal(keysVisited[9], 'd')
})
