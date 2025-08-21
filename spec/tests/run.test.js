var compile = require('../../lib/compile.js')
var run = require('../../lib/run.js')

test('opt - vars', async ({ t }) => {
  var ast = compile('')
  var output = await run(ast, { vars: { hello: 'world' } })
  t.deepEqual(output.state.vars.hello, 'world')
  t.equal(output.state.result, undefined)
  t.equal(output.state.err, undefined)
})

test('empty', async ({ t }) => {
  var ast = compile('')
  var output = await run(ast)
  t.deepEqual(output.state.vars, {})
  t.equal(output.state.result, undefined)
  t.equal(output.state.err, undefined)
})

test('value', async ({ t }) => {
  var ast = compile('a: hello')
  var output = await run(ast)
  t.deepEqual(output.state.vars, {})
  t.equal(output.state.result, undefined)
  t.equal(output.state.err, undefined)
})

test('assign value', async ({ t }) => {
  var ast = compile('=hello: world')
  var output = await run(ast)
  t.equal(Object.keys(output.state.vars).length, 1)
  t.equal(output.state.vars.hello, 'world')
  t.equal(output.state.result, undefined)
  t.equal(output.state.err, undefined)
})

test('assign indirect - string', async ({ t }) => {
  var ast = compile('=hello: world\n=bye: $hello')
  var output = await run(ast)
  t.equal(Object.keys(output.state.vars).length, 2)
  t.equal(output.state.vars.hello, 'world')
  t.equal(output.state.vars.bye, 'world')
  t.equal(output.state.result, undefined)
  t.equal(output.state.err, undefined)
})

test('assign indirect - array', async ({ t }) => {
  var ast = compile('=hello: world\n=bye: [$hello, 2]')
  var output = await run(ast)
  t.equal(Object.keys(output.state.vars).length, 2)
  t.equal(output.state.vars.hello, 'world')
  t.equal(output.state.vars.bye[0], 'world')
  t.equal(output.state.vars.bye[1], 2)
  t.equal(output.state.result, undefined)
  t.equal(output.state.err, undefined)
})

test('assign indirect - object key', async ({ t }) => {
  var ast = compile('=hello: world\n=bye: { $hello: a }')
  var output = await run(ast)
  t.equal(Object.keys(output.state.vars).length, 2)
  t.equal(output.state.vars.hello, 'world')
  t.deepEqual(output.state.vars.bye, { world: 'a' })
  t.equal(output.state.result, undefined)
  t.equal(output.state.err, undefined)
})

test('assign indirect - object value', async ({ t }) => {
  var ast = compile('=hello: world\n=bye: { a: $hello }')
  var output = await run(ast)
  t.equal(Object.keys(output.state.vars).length, 2)
  t.equal(output.state.vars.hello, 'world')
  t.deepEqual(output.state.vars.bye, { a: 'world' })
  t.equal(output.state.result, undefined)
  t.equal(output.state.err, undefined)
})

test('assign multiple - array', async ({ t }) => {
  var ast = compile('=a,b,c: [1,2,3]')
  var output = await run(ast)
  t.equal(output.state.vars.a, 1)
  t.equal(output.state.vars.b, 2)
  t.equal(output.state.vars.c, 3)
  t.equal(output.state.result, undefined)
  t.equal(output.state.err, undefined)
})

test('assign multiple - string', async ({ t }) => {
  var ast = compile('=a,b,c: hello')
  var output = await run(ast)
  t.equal(output.state.vars.a, 'hello')
  t.equal(output.state.vars.b, 'hello')
  t.equal(output.state.vars.c, 'hello')
  t.equal(output.state.result, undefined)
  t.equal(output.state.err, undefined)
})

test('assign func value', async ({ t }) => {
  var ast = compile('=hello@func: world')
  var func = {
    name: 'func',
    handler: async function (ast, node) {
      return 'bye'
    },
  }
  var opt = {
    ext: { func },
  }
  var output = await run(ast, opt)
  t.equal(Object.keys(output.state.vars).length, 1)
  t.equal(output.state.vars.hello, 'bye')
  t.equal(output.state.result, 'bye')
  t.equal(output.state.err, undefined)
})

test('explicit throw on func', async ({ t }) => {
  var ast = compile('=hello@func: world')
  var func = {
    name: 'func',
    handler: function (ast, node) {
      throw new Error('explicit throw')
    },
  }
  var opt = {
    ext: { func },
  }
  var output = await run(ast, opt)
  t.deepEqual(output.state.vars, {})
  t.equal(output.state.result, undefined)
  t.equal(output.state.err, 'error on line 1 column 7: explicit throw')
})

test('throw on missing func', async ({ t }) => {
  var ast = compile('=hello@func: world')
  var opt = {
    ext: {},
  }
  var output = await run(ast, opt)
  t.deepEqual(output.state.vars, {})
  t.equal(output.state.result, undefined)
  t.equal(
    output.state.err,
    'error on line 1 column 7: the function "func" does not exist',
  )
})

test('assign multiple func', async ({ t }) => {
  var ast = compile('=a,b,c@func: {}')
  var func = {
    name: 'func',
    handler: function (ast, node) {
      return [1, 2, 3]
    },
  }
  var opt = {
    ext: { func },
  }
  var output = await run(ast, opt)
  t.equal(output.state.vars.a, 1)
  t.equal(output.state.vars.b, 2)
  t.equal(output.state.vars.c, 3)
  t.deepEqual(output.state.result, [1, 2, 3])
  t.equal(output.state.err, undefined)
})

// - @func1: {}
// - @func2: {}
