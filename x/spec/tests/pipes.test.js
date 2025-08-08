var weblang = require('../../index.js')
var pipes = require('../lib/pipes.js')

test('support pipes with set', async ({ t }) => {
  var code = ['=hello: hello | upcase'].join('\n')
  var state = await weblang.init({ pipes }).run(code)
  t.ok(state.vars.hello == 'HELLO')
})

test('support pipes with set variables', async ({ t }) => {
  var code = ['=hello: hello', '=bye: $hello | upcase'].join('\n')
  var state = await weblang.init({ pipes }).run(code)
  t.ok(state.vars.hello == 'hello')
  t.ok(state.vars.bye == 'HELLO')
})

test('support pipes with return', async ({ t }) => {
  var code = ['@return: hello | upcase'].join('\n')
  var state = await weblang.init({ pipes }).run(code)
  t.ok(state.return == 'HELLO')
})

test('strip pipes with return', async ({ t }) => {
  var code = ['@return: hello | unknown'].join('\n')
  var state = await weblang.init({ pipes }).run(code)
  t.ok(state.return == 'hello')
})

test('work with multiple pipes', async ({ t }) => {
  var code = ['@return: hello | upcase | downcase | capitalize'].join('\n')
  var state = await weblang.init({ pipes }).run(code)
  t.ok(state.return == 'Hello')
})

test('support pipe options', async ({ t }) => {
  var code = ['=arr: [a, b, c]', '@return: $arr | join delimiter=+'].join('\n')
  var state = await weblang.init({ pipes }).run(code)
  t.ok(state.return == 'a+b+c')
})

test('not pipe unknown pipe', async ({ t }) => {
  var code = ['=hello: hello | unknown'].join('\n')
  var state = await weblang.init({ pipes }).run(code)
  t.ok(state.vars.hello == 'hello')
})

test('expand string var with pipe', async ({ t }) => {
  var code = ['=hello: hei', '=result: $hello | upcase'].join('\n')
  var state = await weblang.init({ pipes }).run(code)
  t.ok(state.vars.result == 'HEI')
})

test('pass var through pipe parameter', async ({ t }) => {
  var code = ['=hello: book', '=result: bye | concat a=$hello'].join('\n')
  var state = await weblang.init({ pipes }).run(code)
  t.ok(state.vars.result == 'bye book')
})
