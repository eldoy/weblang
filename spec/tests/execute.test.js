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
    handler: async function () {
      return 'bye'
    },
  }
  var opt = { ext: { func } }
  await execute(ast, node, state, opt)
  t.equal(Object.keys(state.vars).length, 1)
  t.equal(state.vars.hello, 'bye')
  t.equal(state.result, undefined)
  t.equal(state.err, undefined)
})

test('explicit throw on func', async ({ t }) => {
  var ast = compile('=hello@func: world')
  var node = ast[0]
  var state = { vars: {} }
  var func = {
    name: 'func',
    handler: function () {
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
    handler: function () {
      return [1, 2, 3]
    },
  }
  var opt = { ext: { func } }
  await execute(ast, node, state, opt)
  t.equal(state.vars.a, 1)
  t.equal(state.vars.b, 2)
  t.equal(state.vars.c, 3)
  t.deepEqual(state.result, undefined)
  t.equal(state.err, undefined)
})

test('pipes - non-exist error', async ({ t }) => {
  var ast = compile('=hello: hello |> upcase')
  var node = ast[0]
  var state = { vars: {} }
  var pipes = {}
  var opt = { pipes }
  await execute(ast, node, state, opt)
  t.equal(state.vars.hello, undefined)
  t.equal(
    state.err,
    'error on line 1 column 1: the pipe "upcase" does not exist',
  )
})

test('pipes - assign', async ({ t }) => {
  var ast = compile('=hello: hello |> upcase')
  var node = ast[0]
  var state = { vars: {} }
  var pipes = {
    upcase: function (input) {
      return input.toUpperCase()
    },
  }
  var opt = { pipes }
  await execute(ast, node, state, opt)
  t.equal(state.vars.hello, 'HELLO')
})

test('pipes - assign args', async ({ t }) => {
  var ast = compile('=hello: hello |> truncate 2')
  var node = ast[0]
  var state = { vars: {} }
  var pipes = {
    truncate: function (input, n) {
      return input.slice(0, n)
    },
  }
  var opt = { pipes }
  await execute(ast, node, state, opt)
  t.equal(state.vars.hello, 'he')
})

test('pipes - assign indirect args', async ({ t }) => {
  var ast = compile('=bye: $hello |> truncate 2')
  var node = ast[0]
  var state = { vars: { hello: 'world' } }
  var pipes = {
    truncate: function (input, n) {
      return input.slice(0, n)
    },
  }
  var opt = { pipes }
  await execute(ast, node, state, opt)
  t.equal(state.vars.bye, 'wo')
})

// test('support pipes with return', async ({ t }) => {
//   var code = ['@return: hello | upcase'].join('\n')
//   var state = await weblang.init({ pipes }).run(code)
//   t.ok(state.return == 'HELLO')
// })

// test('strip pipes with return', async ({ t }) => {
//   var code = ['@return: hello | unknown'].join('\n')
//   var state = await weblang.init({ pipes }).run(code)
//   t.ok(state.return == 'hello')
// })

// test('work with multiple pipes', async ({ t }) => {
//   var code = ['@return: hello | upcase | downcase | capitalize'].join('\n')
//   var state = await weblang.init({ pipes }).run(code)
//   t.ok(state.return == 'Hello')
// })

// test('support pipe options', async ({ t }) => {
//   var code = ['=arr: [a, b, c]', '@return: $arr | join delimiter=+'].join('\n')
//   var state = await weblang.init({ pipes }).run(code)
//   t.ok(state.return == 'a+b+c')
// })

// test('not pipe unknown pipe', async ({ t }) => {
//   var code = ['=hello: hello | unknown'].join('\n')
//   var state = await weblang.init({ pipes }).run(code)
//   t.ok(state.vars.hello == 'hello')
// })

// test('expand string var with pipe', async ({ t }) => {
//   var code = ['=hello: hei', '=result: $hello | upcase'].join('\n')
//   var state = await weblang.init({ pipes }).run(code)
//   t.ok(state.vars.result == 'HEI')
// })

// test('pass var through pipe parameter', async ({ t }) => {
//   var code = ['=hello: book', '=result: bye | concat a=$hello'].join('\n')
//   var state = await weblang.init({ pipes }).run(code)
//   t.ok(state.vars.result == 'bye book')
// })
