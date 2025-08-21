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
  t.equal(state.result, undefined)
  t.equal(state.err, undefined)
})

test('assign indirect - string', async ({ t }) => {
  var ast = compile('=bye: $hello')
  var node = ast[0]
  var state = { vars: { hello: 'world' } }
  var opt = {}
  await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 2)
  t.equal(state.vars.hello, 'world')
  t.equal(state.vars.bye, 'world')
  t.equal(state.result, undefined)
  t.equal(state.err, undefined)
})

test('assign indirect - array', async ({ t }) => {
  var ast = compile('=bye: [$hello, 2]')
  var node = ast[0]
  var state = { vars: { hello: 'world' } }
  var opt = {}
  await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 2)
  t.equal(state.vars.hello, 'world')
  t.equal(state.vars.bye[0], 'world')
  t.equal(state.vars.bye[1], 2)
  t.equal(state.result, undefined)
  t.equal(state.err, undefined)
})

test('assign indirect - object key', async ({ t }) => {
  var ast = compile('=bye: { $hello: a }')
  var node = ast[0]
  var state = { vars: { hello: 'world' } }
  var opt = {}
  await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 2)
  t.equal(state.vars.hello, 'world')
  t.deepEqual(state.vars.bye, { world: 'a' })
  t.equal(state.result, undefined)
  t.equal(state.err, undefined)
})

test('assign indirect - object value', async ({ t }) => {
  var ast = compile('=bye: { a: $hello }')
  var node = ast[0]
  var state = { vars: { hello: 'world' } }
  var opt = {}
  await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 2)
  t.equal(state.vars.hello, 'world')
  t.deepEqual(state.vars.bye, { a: 'world' })
  t.equal(state.result, undefined)
  t.equal(state.err, undefined)
})

test('assign deconstruct - array', async ({ t }) => {
  var ast = compile('=a,b,c: [1,2,3]')
  var node = ast[0]
  var state = { vars: {} }
  var opt = {}
  await execute(ast, node, state, opt)
  t.equal(state.vars.a, 1)
  t.equal(state.vars.b, 2)
  t.equal(state.vars.c, 3)
  t.equal(state.result, undefined)
  t.equal(state.err, undefined)
})

test('assign deconstruct - string', async ({ t }) => {
  var ast = compile('=a,b,c: hello')
  var node = ast[0]
  var state = { vars: {} }
  var opt = {}
  await execute(ast, node, state, opt)
  t.equal(state.vars.a, 'hello')
  t.equal(state.vars.b, 'hello')
  t.equal(state.vars.c, 'hello')
  t.equal(state.result, undefined)
  t.equal(state.err, undefined)
})

test('assign func value', async ({ t }) => {
  var ast = compile('=hello@func: world')
  var node = ast[0]
  var state = { vars: {} }
  var func = {
    name: 'func',
    handler: async function (ast, node) {
      return 'bye'
    },
  }
  var opt = { ext: { func } }
  await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 1)
  t.equal(state.vars.hello, 'bye')
  t.equal(state.result, 'bye')
  t.equal(state.err, undefined)
})

test('explicit throw on func', async ({ t }) => {
  var ast = compile('=hello@func: world')
  var node = ast[0]
  var state = { vars: {} }
  var func = {
    name: 'func',
    handler: function (ast, node) {
      throw new Error('explicit throw')
    },
  }
  var opt = { ext: { func } }
  await execute(ast, node, state, opt)
  t.deepEqual(state.vars, {})
  t.equal(state.result, undefined)
  t.equal(state.err, 'error on line 1 column 7: explicit throw')
})

test('throw on missing func', async ({ t }) => {
  var ast = compile('=hello@func: world')
  var node = ast[0]
  var state = { vars: {} }
  var opt = { ext: {} }
  await execute(ast, node, state, opt)
  t.deepEqual(state.vars, {})
  t.equal(state.result, undefined)
  t.equal(
    state.err,
    'error on line 1 column 7: the function "func" does not exist',
  )
})

test('assign deconstruct func', async ({ t }) => {
  var ast = compile('=a,b,c@func: {}')
  var node = ast[0]
  var state = { vars: {} }
  var func = {
    name: 'func',
    handler: function (ast, node) {
      return [1, 2, 3]
    },
  }
  var opt = { ext: { func } }
  await execute(ast, node, state, opt)
  t.equal(state.vars.a, 1)
  t.equal(state.vars.b, 2)
  t.equal(state.vars.c, 3)
  t.deepEqual(state.result, [1, 2, 3])
  t.equal(state.err, undefined)
})
