var set = require('../../lib/set.js')

test('value', async ({ t }) => {
  var state = { vars: {}, locals: {} }
  set(state, 'hello', 'world')
  t.equal(state.vars.hello, 'world')
  t.deepEqual(state.locals, {})
})
