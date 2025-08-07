var weblang = require('../../index.js')

test('return a string', async ({ t }) => {
  var code = ['@return: hello'].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.return == 'hello')
})

test('return an object', async ({ t }) => {
  var code = ['@return:', '  name: world'].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.return.name == 'world')
})

test('return an array', async ({ t }) => {
  var code = ['@return:', '  - 1', '  - 2'].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.return.length == 2)
  t.ok(state.return[0] == 1)
  t.ok(state.return[1] == 2)
})

test('return a string variable', async ({ t }) => {
  var code = ['=hello: world', '@return: $hello'].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.return == 'world')
})

test('return an object variable', async ({ t }) => {
  var code = ['=hello:', '  name: world', '@return: $hello'].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.return.name == 'world')
})

test('return an array variable', async ({ t }) => {
  var code = ['=hello:', '  - 1', '  - 2', '@return: $hello'].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.return[0] == 1)
  t.ok(state.return[1] == 2)
})

test('return a variable dot notation', async ({ t }) => {
  var code = [
    '=hello:',
    '  name:',
    '    baner: 1',
    '@return: $hello.name',
  ].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.return.baner == 1)
})

test('return early', async ({ t }) => {
  var code = ['@return: early', '@return: late'].join('\n')
  var state = await weblang.init().run(code)
  t.ok(state.return == 'early')
})
