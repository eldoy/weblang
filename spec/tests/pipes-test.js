const weblang = require('../../index.js')
const pipes = require('../lib/pipes.js')

it('should support pipes with set', async ({ t }) => {
  const state = await weblang.init([
    '=hello: hello | upcase'
  ].join('\n'), { pipes })
  t.ok(state.vars.hello == 'HELLO')
})

it('should support pipes with set variables', async ({ t }) => {
  const state = await weblang.init([
    '=hello: hello',
    '=bye: $hello | upcase'
  ].join('\n'), { pipes })
  t.ok(state.vars.hello == 'hello')
  t.ok(state.vars.bye == 'HELLO')
})

it('should support pipes with return', async ({ t }) => {
  const state = await weblang.init([
    '@return: hello | upcase'
  ].join('\n'), { pipes })
  t.ok(state.return == 'HELLO')
})

it('should strip pipes with return', async ({ t }) => {
  const state = await weblang.init([
    '@return: hello | unknown'
  ].join('\n'), { pipes })
  t.ok(state.return == 'hello')
})

it('should work with multiple pipes', async ({ t }) => {
  const state = await weblang.init([
    '@return: hello | upcase | downcase | capitalize'
  ].join('\n'), { pipes })
  t.ok(state.return == 'Hello')
})

it('should support pipe options', async ({ t }) => {
  const state = await weblang.init([
    '=arr: [a, b, c]',
    '@return: $arr | join delimiter=+'
  ].join('\n'), { pipes })
  t.ok(state.return == 'a+b+c')
})

it('should not pipe unknown pipe', async ({ t }) => {
  const state = await weblang.init([
    '=hello: hello | unknown'
  ].join('\n'), { pipes })
  t.ok(state.vars.hello == 'hello')
})

it('should expand string var with pipe', async ({ t }) => {
  const state = await weblang.init([
    '=hello: hei',
    '=result: $hello | upcase'
  ].join('\n'), { pipes })
  t.ok(state.vars.result == 'HEI')
})

it('should pass var through pipe parameter', async ({ t }) => {
  const state = await weblang.init([
    '=hello: book',
    '=result: bye | concat a=$hello'
  ].join('\n'), { pipes })
  t.ok(state.vars.result == 'bye book')
})
