var shape = require('../../lib/shape.js')

test('empty', async ({ t }) => {
  var tree = {}
  var result = shape(tree)
  t.equal({ root: { children: [] } })
})
