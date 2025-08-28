var get = require('../../lib/get.js')

test('value', async ({ t }) => {
  var state = { vars: { hello: 'world' } }
  var data = get(state.vars, 'hello')
  t.equal(data, 'world')
})
