let weblang = require('../../index.js')
let pipes = require('../lib/pipes.js')

it('should support pipes with set', async ({ t }) => {
  let code = [
    '=hello: hello | upcase'
  ].join('\n')
  let state = await weblang.init({ pipes }).run(code)
  t.ok(state.vars.hello == 'HELLO')
})

it('should support pipes with set variables', async ({ t }) => {
  let code = [
    '=hello: hello',
    '=bye: $hello | upcase'
  ].join('\n')
  let state = await weblang.init({ pipes }).run(code)
  t.ok(state.vars.hello == 'hello')
  t.ok(state.vars.bye == 'HELLO')
})

it('should support pipes with return', async ({ t }) => {
  let code = [
    '@return: hello | upcase'
  ].join('\n')
  let state = await weblang.init({ pipes }).run(code)
  t.ok(state.return == 'HELLO')
})

it('should strip pipes with return', async ({ t }) => {
  let code = [
    '@return: hello | unknown'
  ].join('\n')
  let state = await weblang.init({ pipes }).run(code)
  t.ok(state.return == 'hello')
})

it('should work with multiple pipes', async ({ t }) => {
  let code = [
    '@return: hello | upcase | downcase | capitalize'
  ].join('\n')
  let state = await weblang.init({ pipes }).run(code)
  t.ok(state.return == 'Hello')
})

it('should support pipe options', async ({ t }) => {
  let code = [
    '=arr: [a, b, c]',
    '@return: $arr | join delimiter=+'
  ].join('\n')
  let state = await weblang.init({ pipes }).run(code)
  t.ok(state.return == 'a+b+c')
})

it('should not pipe unknown pipe', async ({ t }) => {
  let code = [
    '=hello: hello | unknown'
  ].join('\n')
  let state = await weblang.init({ pipes }).run(code)
  t.ok(state.vars.hello == 'hello')
})

it('should expand string var with pipe', async ({ t }) => {
  let code = [
    '=hello: hei',
    '=result: $hello | upcase'
  ].join('\n')
  let state = await weblang.init({ pipes }).run(code)
  t.ok(state.vars.result == 'HEI')
})

it('should pass var through pipe parameter', async ({ t }) => {
  let code = [
    '=hello: book',
    '=result: bye | concat a=$hello'
  ].join('\n')
  let state = await weblang.init({ pipes }).run(code)
  t.ok(state.vars.result == 'bye book')
})
