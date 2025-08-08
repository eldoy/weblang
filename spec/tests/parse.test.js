var parse = require('../../lib/parse.js')

test('simple', async ({ t }) => {
  var result = parse('@a: hello')
  var expect = { '@a': 'hello' }
  t.deepEqual(result, expect)
})
