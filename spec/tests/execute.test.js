var compile = require('../../lib/compile.js')
var execute = require('../../lib/execute.js')

test('assign value', async ({ t }) => {
  var ast = compile('=hello: world')
  var node = ast[0]
  var state = { vars: {} }
  var opt = {}
  await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 1)
  t.equal(state.vars.hello, 'world')
})

test('assign indirect - value', async ({ t }) => {
  var ast = compile('=bye: $hello')
  var node = ast[0]
  var state = { vars: { hello: 'world' } }
  var opt = {}
  await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 2)
  t.equal(state.vars.hello, 'world')
  t.equal(state.vars.bye, 'world')
})

test('assign func value', async ({ t }) => {
  var ast = compile('=result@func: world')
  var node = ast[0]
  var state = { vars: {} }
  var func = {
    name: 'func',
    handler: async function ({ data }) {
      return 'hello ' + data
    },
  }
  var opt = { ext: { func } }
  await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 1)
  t.equal(state.vars.result, 'hello world')
})

test('assign func error', async ({ t }) => {
  var ast = compile('=result,err@func: hello')
  var node = ast[0]
  var state = { vars: {} }
  var func = {
    name: 'func',
    handler: function () {
      throw Error('bye')
    },
  }
  var opt = { ext: { func } }
  await execute(ast, node, state, opt)
  t.deepStrictEqual(state.vars.result, 'hello')
  t.equal(state.vars.err, 'bye')
})
