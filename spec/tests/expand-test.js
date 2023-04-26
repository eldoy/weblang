const expand = require('../../lib/expand.js')

it('should not expand simple string value', async ({ t }) => {
  const state = {}
  const result = expand('hello', state)
  t.ok(result === 'hello')
})

it('should not expand simple number value', async ({ t }) => {
  const state = {}
  const result = expand(1, state)
  t.ok(result === 1)
})

it('should expand string var', async ({ t }) => {
  const state = {
    vars: {
      hello: 'world'
    }
  }
  const result = expand('$hello', state)
  t.ok(result === 'world')
})

it('should support $ in string', async ({ t }) => {
  const state = {}
  const result = expand('$$hello', state)
  t.ok(result === '$hello')
})

it('should expand object var deeply dotted', async ({ t }) => {
  const state = {
    vars: {
      hello: {
        name: 'world'
      }
    }
  }
  const result = expand({
    'hello.really': '$hello'
  }, state)
  t.deepEqual(result, {
    hello: {
      really: { name: 'world' }
    }
  })
})


it('should return the correct type', async ({ t }) => {
  const state = {}
  let result = expand('hello', state)
  t.ok(result == 'hello')

  result = expand(true, state)
  t.ok(result === true)

  result = expand(false, state)
  t.ok(result === false)

  result = expand(null, state)
  t.ok(result === null)

  result = expand(5, state)
  t.ok(result === 5)

  result = expand('5', state)
  t.ok(result === '5')

  result = expand('5 | unknown', state)
  t.ok(result === '5')

  result = expand('true', state)
  t.ok(result === 'true')

  result = expand('false', state)
  t.ok(result === 'false')

  result = expand('null', state)
  t.ok(result === 'null')
})
