var expand = require('../../lib/expand.js')

test('no match', ({ t }) => {
  var state = {
    vars: {},
  }
  var result = expand(state, '$hello')
  t.equal(result, undefined)
})

test('string', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, '$hello')
  t.equal(result, 'world')
})

test('array - empty', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, [])
  t.deepEqual(result, [])
})

test('array - no match', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, [1, 2])
  t.deepEqual(result, [1, 2])
})

test('array - replace', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, [1, '$hello'])
  t.deepEqual(result, [1, 'world'])
})

test('object - key', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, { $hello: 'a' })
  t.deepEqual(result, { world: 'a' })
})

test('object - value', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, { a: '$hello' })
  t.deepEqual(result, { a: 'world' })
})

test('object - deep', ({ t }) => {
  var state = {
    vars: { hello: 'world' },
  }
  var result = expand(state, { a: { b: '$hello' } })
  t.deepEqual(result, {
    a: { b: 'world' },
  })
})
