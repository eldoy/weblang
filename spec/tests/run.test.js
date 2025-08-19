var compile = require('../../lib/compile.js')
var run = require('../../lib/run.js')

test('empty', async ({ t }) => {
  var ast = compile('')
  var output = run(ast)
  t.equal(output.state.result, null)
  t.equal(output.state.err, null)
})

test('value', async ({ t }) => {
  var ast = compile('a: hello')
  var output = run(ast)
  t.equal(output.state.result, null)
  t.equal(output.state.err, null)
})
