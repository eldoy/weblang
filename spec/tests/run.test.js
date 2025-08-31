var compile = require('../../lib/compile.js')
var run = require('../../lib/run.js')

test('opt - vars', async ({ t }) => {
  var ast = compile('')
  var opt = { vars: { hello: 'world' } }
  var result = await run(ast, opt)
  t.deepEqual(result.state.vars.hello, 'world')
})

test('empty', async ({ t }) => {
  var ast = compile('')
  var result = await run(ast)
  t.deepEqual(result.state.vars, {})
})

test('state', async ({ t }) => {
  var ast = compile('=hello: world')
  var result = await run(ast)
  t.equal(result.state.root.id, 's-1-1-1-1')
  t.deepEqual(result.state.vars, { hello: 'world' })
})

test('return', async ({ t }) => {
  var ast = compile(['@return: hello', '=hello: world'].join('\n'))
  var opt = {}
  var result = await run(ast, opt)
  t.equal(result.state.return, 'hello')
  t.strictEqual(result.state.vars.hello, undefined)
})

test('last', async ({ t }) => {
  var ast = compile('@func: hello')
  var opt = {
    ext: {
      func: {
        name: 'func',
        handler: async function () {
          return 'hello'
        },
      },
    },
  }
  var result = await run(ast, opt)
  t.equal(result.state.last, 'hello')
  t.equal(result.state.return, 'hello')
})
