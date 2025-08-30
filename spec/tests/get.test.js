var get = require('../../lib/get.js')

test('value', async ({ t }) => {
  var state = { vars: { hello: 'world' } }
  var result = get(state, 'hello')
  t.equal(result, 'world')
})
