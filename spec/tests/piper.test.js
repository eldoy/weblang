var piper = require('../../lib/piper.js')

test('single', async ({ t }) => {
  var [input, pipes] = piper('hello |> pipe')
  t.equal(input, 'hello')
  t.deepEqual(pipes, [{ name: 'pipe' }])
})

test('single - string', async ({ t }) => {
  var [input, pipes] = piper('hello |> pipe hello')
  t.equal(input, 'hello')
  t.deepEqual(pipes, [{ name: 'pipe', args: ['hello'] }])
})

test('single - number', async ({ t }) => {
  var [input, pipes] = piper('hello |> pipe 2')
  t.equal(input, 'hello')
  t.deepEqual(pipes, [{ name: 'pipe', args: [2] }])
})

test('single - bool', async ({ t }) => {
  var [input, pipes] = piper('hello |> pipe true')
  t.equal(input, 'hello')
  t.deepEqual(pipes, [{ name: 'pipe', args: [true] }])
})

test('single - array', async ({ t }) => {
  var [input, pipes] = piper('hello |> pipe 1,2,3')
  t.equal(input, 'hello')
  t.deepEqual(pipes, [{ name: 'pipe', args: [[1, 2, 3]] }])
})

test('single - object', async ({ t }) => {
  var [input, pipes] = piper('hello |> pipe a=1 b=2')
  t.equal(input, 'hello')
  t.deepEqual(pipes, [{ name: 'pipe', args: [{ a: 1, b: 2 }] }])
})

test('multiple', async ({ t }) => {
  var [input, pipes] = piper('hello |> pipe 2 |> fipe a=b')
  t.equal(input, 'hello')
  t.deepEqual(pipes, [
    { name: 'pipe', args: [2] },
    { name: 'fipe', args: [{ a: 'b' }] },
  ])
})
