var build = require('../../lib/build.js')

test('returns root nodes in order', ({ t }) => {
  var tree = { a: 1, b: 2, c: 3 }
  var visited = []

  build(tree, (node) => {
    visited.push(node)
  })

  t.equal(visited[0], 1)
  t.equal(visited[1], 2)
  t.equal(visited[2], 3)
})
