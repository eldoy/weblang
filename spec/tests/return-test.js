const weblang = require('../../index.js')

it('should return a string', async ({ t }) => {
  const state = await weblang.init([
    '@return: hello'
  ].join('\n'))
  t.ok(state.return == 'hello')
})

it('should return an object', async ({ t }) => {
  const state = await weblang.init([
    '@return:',
    '  name: world'
  ].join('\n'))
  t.ok(state.return.name == 'world')
})

it('should return an array', async ({ t }) => {
  const state = await weblang.init([
    '@return:',
    '  - 1',
    '  - 2'
  ].join('\n'))
  t.ok(state.return.length == 2)
  t.ok(state.return[0] == 1)
  t.ok(state.return[1] == 2)
})

it('should return a string variable', async ({ t }) => {
  const state = await weblang.init([
    '=hello: world',
    '@return: $hello'
  ].join('\n'))
  t.ok(state.return == 'world')
})

it('should return an object variable', async ({ t }) => {
  const state = await weblang.init([
    '=hello:',
    '  name: world',
    '@return: $hello'
  ].join('\n'))
  t.ok(state.return.name == 'world')
})

it('should return an array variable', async ({ t }) => {
  const state = await weblang.init([
    '=hello:',
    '  - 1',
    '  - 2',
    '@return: $hello'
  ].join('\n'))
  t.ok(state.return[0] == 1)
  t.ok(state.return[1] == 2)
})

it('should return a variable dot notation', async ({ t }) => {
  const state = await weblang.init([
    '=hello:',
    '  name:',
    '    baner: 1',
    '@return: $hello.name'
  ].join('\n'))
  t.ok(state.return.baner == 1)
})

it('should return early', async ({ t }) => {
  const state = await weblang.init([
    '@return: early',
    '@return: late'
  ].join('\n'))
  t.ok(state.return == 'early')
})