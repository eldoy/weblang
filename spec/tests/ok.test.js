var ok = require('../../lib/ok.js')

test('value', async ({ t }) => {
  var data = { $hello: { is: 'string' } }
  var state = { vars: { hello: 'world' } }
  var result = await ok(data, state)
  t.equal(result, true)
})

test('bool', async ({ t }) => {
  var state = { vars: {} }

  t.equal(await ok(true, state), true)
  t.equal(await ok(false, state), false)
})

test('string', async ({ t }) => {
  var state = { vars: {} }

  t.equal(await ok('hello', state), true)
  t.equal(await ok('', state), false)
})

test('number', async ({ t }) => {
  var state = { vars: {} }

  t.equal(await ok(1, state), true)
  t.equal(await ok(0, state), false)
})

test('var', async ({ t }) => {
  var state = {
    vars: { a: true }
  }
  t.equal(await ok('$a', state), true)
})
