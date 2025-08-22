var compile = require('../../lib/compile.js')
var run = require('../../lib/run.js')

test('opt - vars', async ({ t }) => {
  var ast = compile('')
  var output = await run(ast, { vars: { hello: 'world' } })
  t.deepEqual(output.state.vars.hello, 'world')
})

test('empty', async ({ t }) => {
  var ast = compile('')
  var output = await run(ast)
  t.deepEqual(output.state.vars, {})
})

test('state', async ({ t }) => {
  var ast = compile('=hello: world')
  var output = await run(ast)
  t.deepEqual(output.state.vars, { hello: 'world' })
})

test('error', async ({ t }) => {
  var ast = compile('=hello: world |> upcase')
  var output = await run(ast)
  t.equal(
    output.state.err,
    'error on line 1 column 1: the pipe "upcase" does not exist',
  )
  t.deepEqual(output.state.vars, {})
})
