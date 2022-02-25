const expand = require('../../lib/expand.js')
const pipes = require('../../lib/pipes.js')

it('should not expand empty object', async ({ t }) => {
  const state = {}
  const result = expand({})
  t.deepEqual(result, {})
})

it('should not expand normal object', async ({ t }) => {
  const state = {}
  const result = expand({
    val: 2
  })
  t.deepEqual(result, { val: 2 })
})

it('should expand with undefined if var undefined', async ({ t }) => {
  const state = {
    vars: {}
  }
  const result = expand({
    hello: '$hello'
  }, state)
  const keys = Object.keys(result)
  t.ok(keys.length == 0)
  t.ok(typeof result.hello == 'undefined')
})

it('should expand integer var', async ({ t }) => {
  const state = {
    vars: {
      hello: 1
    }
  }
  const result = expand({
    hello: '$hello'
  }, state)
  t.deepEqual(result, { hello: 1 })
})

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

it('should expand object var', async ({ t }) => {
  const state = {
    vars: {
      hello: {
        name: 'world'
      }
    }
  }
  const result = expand({
    hello: '$hello'
  }, state)
  t.deepEqual(result, {
    hello: { name: 'world' }
  })
})

it('should expand array var', async ({ t }) => {
  const state = {
    vars: {
      hello: {
        names: ['arne', 'barne', 'larne']
      }
    }
  }
  const result = expand({
    hello: '$hello'
  }, state)
  t.deepEqual(result, {
    hello: { names: ['arne', 'barne', 'larne'] }
  })
})

it('should expand object var deeply', async ({ t }) => {
  const state = {
    vars: {
      hello: {
        name: 'world'
      }
    }
  }
  const result = expand({
    hello: {
      really: '$hello'
    }
  }, state)
  t.deepEqual(result, {
    hello: {
      really: { name: 'world' }
    }
  })
})

it('should expand array var deeply', async ({ t }) => {
  const state = {
    vars: {
      hello: {
        name: 'world'
      }
    }
  }
  const result = expand({
    hello: ['$hello']
  }, state)
  t.deepEqual(result, {
    hello: [{ name: 'world' }]
  })
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

it('should not pipe unknown pipe', async ({ t }) => {
  const state = {}
  const result = expand('hello | unknown', state, { pipes })
  t.ok(result == 'hello')
})

it('should pipe string value', async ({ t }) => {
  const state = {}
  const result = expand('hello | upcase', state, { pipes })
  t.ok(result == 'HELLO')
})

it('should expand string var with pipe', async ({ t }) => {
  const state = {
    vars: {
      hello: 'world'
    }
  }
  const result = expand('$hello | upcase', state, { pipes })
  t.ok(result == 'WORLD')
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
