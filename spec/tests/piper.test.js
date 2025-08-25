var piper = require('../../lib/piper.js')

test('no pipes', async ({ t }) => {
  var { head, pipes } = piper('hello')
  t.equal(head, 'hello')
  t.deepEqual(pipes, [])
})

test('single pipe no args', async ({ t }) => {
  var { head, pipes } = piper('foo |> bar')
  t.equal(head, 'foo')
  t.deepEqual(pipes, [{ name: 'bar', argsRaw: [] }])
})

test('single pipe with args', async ({ t }) => {
  var { head, pipes } = piper('foo |> bar x y')
  t.equal(head, 'foo')
  t.deepEqual(pipes, [{ name: 'bar', argsRaw: ['x', 'y'] }])
})

test('multiple pipes chained', async ({ t }) => {
  var { head, pipes } = piper('foo |> bar x |> baz y z')
  t.equal(head, 'foo')
  t.deepEqual(pipes, [
    { name: 'bar', argsRaw: ['x'] },
    { name: 'baz', argsRaw: ['y', 'z'] },
  ])
})

test('pipe with comma args', async ({ t }) => {
  var { head, pipes } = piper('foo |> bar a,b,c')
  t.equal(head, 'foo')
  t.deepEqual(pipes, [{ name: 'bar', argsRaw: ['a,b,c'] }])
})

test('pipe with equals args', async ({ t }) => {
  var { head, pipes } = piper('foo |> bar x=1 y=$val')
  t.equal(head, 'foo')
  t.deepEqual(pipes, [{ name: 'bar', argsRaw: ['x=1', 'y=$val'] }])
})
