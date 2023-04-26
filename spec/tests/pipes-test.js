const weblang = require('../../index.js')
const pipes = require('../lib/pipes.js')

it('should support pipes with set', async ({ t }) => {
  const state = await weblang({ pipes })([
    '$hello: hello | upcase'
  ].join('\n'))
  t.ok(state.vars.hello == 'HELLO')
})

it('should support pipes with set variables', async ({ t }) => {
  const state = await weblang({ pipes })([
    '$hello: hello',
    '$bye: $hello | upcase'
  ].join('\n'))
  t.ok(state.vars.hello == 'hello')
  t.ok(state.vars.bye == 'HELLO')
})

it('should support pipes with return', async ({ t }) => {
  const state = await weblang({ pipes })([
    '@return: hello | upcase'
  ].join('\n'))
  t.ok(state.return == 'HELLO')
})

it('should strip pipes with return', async ({ t }) => {
  const state = await weblang({ pipes })([
    '@return: hello | unknown'
  ].join('\n'))
  t.ok(state.return == 'hello')
})

it('should work with multiple pipes', async ({ t }) => {
  const state = await weblang({ pipes })([
    '@return: hello | upcase | downcase | capitalize'
  ].join('\n'))
  t.ok(state.return == 'Hello')
})
