var ok = require('../../lib/ok.js')

test('value', async ({ t }) => {
  var schema = { $hello: { is: 'string' } }
  var state = { vars: { hello: 'world' } }
  var result = await ok(schema, state)
  t.equal(result, true)
})
