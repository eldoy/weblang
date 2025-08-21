var ok = require('../../lib/ok.js')

test('string', async ({ t }) => {
  var val = { hello: { is: 'string' } }
  var state = { vars: { hello: 'world' } }
  var result = await ok(val, state.vars)
  t.equal(result, true)
})
