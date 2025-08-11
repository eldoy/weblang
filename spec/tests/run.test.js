var run = require('../../lib/run.js')

test('empty', async ({ t }) => {
  var result = run({})
  var expect = {}
  t.deepEqual(result, expect)
})
