var resolve = require('../../lib/resolve.js')

function dispatch(v) {
  return { kind: 'dispatched', value: v }
}

test('array with plain values', async ({ t }) => {
  var result = resolve([1, 2, 3], dispatch)
  t.deepEqual(result, { kind: 'literal', data: [1, 2, 3] })
})

test('array with string needing dispatch', async ({ t }) => {
  var result = resolve(['$foo', 'bar'], dispatch)
  t.deepEqual(result, {
    kind: 'literal',
    data: [{ kind: 'dispatched', value: '$foo' }, 'bar'],
  })
})

test('array with pipe string', async ({ t }) => {
  var result = resolve(['foo |> bar'], dispatch)
  t.deepEqual(result, {
    kind: 'literal',
    data: [{ kind: 'dispatched', value: 'foo |> bar' }],
  })
})

test('object with plain properties', async ({ t }) => {
  var result = resolve({ a: 1, b: 'c' }, dispatch)
  t.deepEqual(result, { kind: 'literal', data: { a: 1, b: 'c' } })
})

test('object with $key', async ({ t }) => {
  var result = resolve({ $foo: 'bar' }, dispatch)
  t.deepEqual(result, {
    kind: 'literal',
    data: {
      key: { kind: 'var', path: ['foo'] },
      value: { kind: 'dispatched', value: 'bar' },
    },
  })
})

test('object with string needing dispatch', async ({ t }) => {
  var result = resolve({ a: '$foo', b: 'baz |> qux' }, dispatch)
  t.deepEqual(result, {
    kind: 'literal',
    data: {
      a: { kind: 'dispatched', value: '$foo' },
      b: { kind: 'dispatched', value: 'baz |> qux' },
    },
  })
})

test('object with plain non-string values untouched', async ({ t }) => {
  var result = resolve({ a: 123, b: true }, dispatch)
  t.deepEqual(result, { kind: 'literal', data: { a: 123, b: true } })
})
