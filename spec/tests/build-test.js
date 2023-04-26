const build = require('../../lib/build.js')

it('should not change empty object', async ({ t }) => {
  const obj = {}
  build(obj)
  t.deepEqual(obj, {})
})

it('should not change normal object', async ({ t }) => {
  const obj = {
    val: 2
  }
  build(obj)
  t.deepEqual(obj, { val: 2 })
})

it('should build with undefined if var undefined', async ({ t }) => {
  const state = {
    vars: {}
  }
  const obj = {
    hello: '$hello'
  }
  build(obj, state)
  const keys = Object.keys(obj)
  t.ok(keys.length == 0)
  t.ok(typeof obj.hello == 'undefined')
})

it('should build integer var', async ({ t }) => {
  const state = {
    vars: {
      hello: 1
    }
  }
  const obj = {
    hello: '$hello'
  }
  build(obj, state)
  t.deepEqual(obj, { hello: 1 })
})

it('should build object var', async ({ t }) => {
  const state = {
    vars: {
      hello: {
        name: 'world'
      }
    }
  }
  const obj = {
    hello: '$hello'
  }

  build(obj, state)
  t.deepEqual(obj, {
    hello: { name: 'world' }
  })
})

it('should build array var', async ({ t }) => {
  const state = {
    vars: {
      hello: {
        names: ['arne', 'barne', 'larne']
      }
    }
  }
  const obj = {
    hello: '$hello'
  }
  build(obj, state)
  t.deepEqual(obj, {
    hello: { names: ['arne', 'barne', 'larne'] }
  })
})

it('should build object var deeply', async ({ t }) => {
  const state = {
    vars: {
      hello: {
        name: 'world'
      }
    }
  }
  const obj = {
    hello: {
      really: '$hello'
    }
  }
  build(obj, state)
  t.deepEqual(obj, {
    hello: {
      really: { name: 'world' }
    }
  })
})

it('should build array var deeply', async ({ t }) => {
  const state = {
    vars: {
      hello: {
        name: 'world'
      }
    }
  }
  const obj = {
    hello: ['$hello']
  }
  build(obj, state)
  t.deepEqual(obj, {
    hello: [{ name: 'world' }]
  })
})
