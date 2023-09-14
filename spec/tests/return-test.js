let weblang = require('../../index.js')

it('should return a string', async ({ t }) => {
  let code = [
    '@return: hello'
  ].join('\n')
  let state = await weblang.init().run(code)
  t.ok(state.return == 'hello')
})

it('should return an object', async ({ t }) => {
  let code = [
    '@return:',
    '  name: world'
  ].join('\n')
  let state = await weblang.init().run(code)
  t.ok(state.return.name == 'world')
})

it('should return an array', async ({ t }) => {
  let code = [
    '@return:',
    '  - 1',
    '  - 2'
  ].join('\n')
  let state = await weblang.init().run(code)
  t.ok(state.return.length == 2)
  t.ok(state.return[0] == 1)
  t.ok(state.return[1] == 2)
})

it('should return a string variable', async ({ t }) => {
  let code = [
    '=hello: world',
    '@return: $hello'
  ].join('\n')
  let state = await weblang.init().run(code)
  t.ok(state.return == 'world')
})

it('should return an object variable', async ({ t }) => {
  let code = [
    '=hello:',
    '  name: world',
    '@return: $hello'
  ].join('\n')
  let state = await weblang.init().run(code)
  t.ok(state.return.name == 'world')
})

it('should return an array variable', async ({ t }) => {
  let code = [
    '=hello:',
    '  - 1',
    '  - 2',
    '@return: $hello'
  ].join('\n')
  let state = await weblang.init().run(code)
  t.ok(state.return[0] == 1)
  t.ok(state.return[1] == 2)
})

it('should return a variable dot notation', async ({ t }) => {
  let code = [
    '=hello:',
    '  name:',
    '    baner: 1',
    '@return: $hello.name'
  ].join('\n')
  let state = await weblang.init().run(code)
  t.ok(state.return.baner == 1)
})

it('should return early', async ({ t }) => {
  let code = [
    '@return: early',
    '@return: late'
  ].join('\n')
  let state = await weblang.init().run(code)
  t.ok(state.return == 'early')
})