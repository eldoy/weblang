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
  t.deepEqual(output.state.vars, {})
  t.equal(output.state.result, null)
  t.equal(output.state.err, null)
})

test('assign value', async ({ t }) => {
  var ast = compile('=hello: world')
  var output = run(ast)
  t.equal(output.state.vars.hello, 'world')
  t.equal(output.state.result, null)
  t.equal(output.state.err, null)
})

test('assign, get value', async ({ t }) => {
  var ast = compile('=hello: world\n =bye: $hello')
  var output = run(ast)
  t.equal(output.state.vars.hello, 'world')
  t.equal(output.state.vars.bye, 'world')
  t.equal(output.state.result, null)
  t.equal(output.state.err, null)
})

// Create tests for, and possible variations:
// =hello: world ✅
// =bye: $hello ✅
// =hello@func: world
// =a,b,c: [1,2,3]
// =a,b@func: {}
// @func: {}
// @func: { @func: {} }
// @func: [$a, 1, 2]
// @func: { a: $a, b: $b, c: 2 }
// - @func1: {}
// - @func2: {}
