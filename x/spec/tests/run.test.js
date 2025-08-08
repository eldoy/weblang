var run = require('../../lib/run.js')

test('run', async ({ t }) => {
  var result = run()
  var expect = ''
  t.equal(result, expect)
})
