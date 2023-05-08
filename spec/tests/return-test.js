const weblang = require('../../index.js')

it('should return a string', async ({ t }) => {
  const code = [
    '@return: hello'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.return == 'hello')
})

it('should return an object', async ({ t }) => {
  const code = [
    '@return:',
    '  name: world'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.return.name == 'world')
})

it('should return an array', async ({ t }) => {
  const code = [
    '@return:',
    '  - 1',
    '  - 2'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.return.length == 2)
  t.ok(state.return[0] == 1)
  t.ok(state.return[1] == 2)
})

it('should return a string variable', async ({ t }) => {
  const code = [
    '=hello: world',
    '@return: $hello'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.return == 'world')
})

it('should return an object variable', async ({ t }) => {
  const code = [
    '=hello:',
    '  name: world',
    '@return: $hello'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.return.name == 'world')
})

it('should return an array variable', async ({ t }) => {
  const code = [
    '=hello:',
    '  - 1',
    '  - 2',
    '@return: $hello'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.return[0] == 1)
  t.ok(state.return[1] == 2)
})

it('should return a variable dot notation', async ({ t }) => {
  const code = [
    '=hello:',
    '  name:',
    '    baner: 1',
    '@return: $hello.name'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.return.baner == 1)
})

it('should return early', async ({ t }) => {
  const code = [
    '@return: early',
    '@return: late'
  ].join('\n')
  const state = await weblang.init().run(code)
  t.ok(state.return == 'early')
})