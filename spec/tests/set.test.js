var set = require('../../lib/set.js')

test('data', async ({ t }) => {
  var state = { vars: {} }
  var result = set(state.vars, 'hello', 'world')
  t.equal(state.vars.hello, 'world')
})
