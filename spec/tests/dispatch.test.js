var dispatch = require('../../lib/dispatch.js')

test('literal null', async ({ t }) => {
  var result = dispatch(null)
  t.deepEqual(result, { kind: 'literal', data: null })
})

test('boolean', async ({ t }) => {
  var result = dispatch(true)
  t.deepEqual(result, { kind: 'literal', data: true })

  result = dispatch('false')
  t.deepEqual(result, { kind: 'literal', data: false })
})

test('number', async ({ t }) => {
  var result = dispatch(42)
  t.deepEqual(result, { kind: 'literal', data: 42 })

  result = dispatch('3.14')
  t.deepEqual(result, { kind: 'literal', data: 3.14 })
})

test('plain string', async ({ t }) => {
  var result = dispatch('hello')
  t.deepEqual(result, { kind: 'literal', data: 'hello' })
})

test('escaped string', async ({ t }) => {
  var result = dispatch('\\$foo')
  t.deepEqual(result, { kind: 'literal', data: '$foo' })
})

test('variable string', async ({ t }) => {
  var result = dispatch('$foo')
  t.deepEqual(result, { kind: 'var', path: ['foo'] })
})

test('array of values', async ({ t }) => {
  var result = dispatch(['1', '$x'])
  t.deepEqual(result, {
    kind: 'literal',
    data: [
      '1', // stays raw string
      { kind: 'var', path: ['x'] },
    ],
  })
})

test('object with mixed props', async ({ t }) => {
  var result = dispatch({ a: '1', $b: '2' })
  t.deepEqual(result, {
    kind: 'literal',
    data: {
      a: '1', // left raw
      key: { kind: 'var', path: ['b'] },
      value: { kind: 'literal', data: 2 },
    },
  })
})

test('pipe expression simple', async ({ t }) => {
  var result = dispatch('foo |> bar')
  t.equal(result.kind, 'literal')
  t.ok(Array.isArray(result.pipes))
  t.equal(result.pipes[0].name, 'bar')
})

test('pipe expression with args', async ({ t }) => {
  var result = dispatch('foo |> bar x y')
  t.equal(result.kind, 'literal')
  t.equal(result.pipes[0].name, 'bar')
  t.deepEqual(result.pipes[0].args[0], { kind: 'literal', data: 'x' })
  t.deepEqual(result.pipes[0].args[1], { kind: 'literal', data: 'y' })
})

test('pipe expression with comma arg', async ({ t }) => {
  var result = dispatch('foo |> bar a,b,c')
  t.equal(result.kind, 'literal')
  t.equal(result.pipes[0].name, 'bar')
  t.deepEqual(result.pipes[0].args[0], {
    kind: 'literal',
    data: [
      { kind: 'literal', data: 'a' },
      { kind: 'literal', data: 'b' },
      { kind: 'literal', data: 'c' },
    ],
  })
})

test('pipe expression with assignment args', async ({ t }) => {
  var result = dispatch('foo |> bar x=1 y=$z')
  t.equal(result.kind, 'literal')
  t.equal(result.pipes[0].name, 'bar')
  t.deepEqual(result.pipes[0].args[0], {
    kind: 'assign',
    path: ['x'],
    value: { kind: 'literal', data: 1 },
  })
  t.deepEqual(result.pipes[0].args[1], {
    kind: 'assign',
    path: ['y'],
    value: { kind: 'var', path: ['z'] },
  })
})
