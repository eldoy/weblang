var literal = require('../../lib/literal.js')

test('null', async ({ t }) => {
  var result = literal(null)
  t.deepEqual(result, { kind: 'literal', data: null })
})

test('boolean strings', async ({ t }) => {
  var result = literal('true')
  t.deepEqual(result, { kind: 'literal', data: true })

  result = literal('false')
  t.deepEqual(result, { kind: 'literal', data: false })
})

test('booleans', async ({ t }) => {
  var result = literal(true)
  t.deepEqual(result, { kind: 'literal', data: true })

  result = literal(false)
  t.deepEqual(result, { kind: 'literal', data: false })
})

test('number strings', async ({ t }) => {
  var result = literal('42')
  t.deepEqual(result, { kind: 'literal', data: 42 })

  result = literal('3.14')
  t.deepEqual(result, { kind: 'literal', data: 3.14 })
})

test('numbers', async ({ t }) => {
  var result = literal(0)
  t.deepEqual(result, { kind: 'literal', data: 0 })

  result = literal(99)
  t.deepEqual(result, { kind: 'literal', data: 99 })
})

test('escaped string', async ({ t }) => {
  var result = literal('\\$foo')
  t.deepEqual(result, { kind: 'literal', data: '$foo' })
})

test('variable string', async ({ t }) => {
  var result = literal('$foo')
  t.deepEqual(result, { kind: 'var', path: ['foo'] })

  result = literal('$a.b.c')
  t.deepEqual(result, { kind: 'var', path: ['a', 'b', 'c'] })
})

test('plain string', async ({ t }) => {
  var result = literal('hello')
  t.deepEqual(result, { kind: 'literal', data: 'hello' })
})

test('unsupported types return null', async ({ t }) => {
  var result = literal({})
  t.equal(result, null)

  result = literal([])
  t.equal(result, null)
})
