var compile = require('../../lib/compile.js')

test('no value', async ({ t }) => {
  var result = compile()
  t.deepEqual(result, [])
})

test('empty string', async ({ t }) => {
  var result = compile('')
  t.deepEqual(result, [])
})

test('value', async ({ t }) => {
  var result = compile('a: hello')
  t.deepEqual(result, [])
})
