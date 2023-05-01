const weblang = require('../../index.js')
const { db } = require('../lib/ext.js')

it('should support custom extensions', async ({ t }) => {
  const code = '@db: user/create'
  const state = await weblang.init(code, { ext: { db } })
  t.ok(state.vars.internal == 'hello')
})

it('should set variable with extensions', async ({ t }) => {
  const code = [
    '=result@db: user/create',
    '@return: $result'
  ].join('\n')
  const state = await weblang.init(code, { ext: { db } })
  t.ok(state.vars.result.id == '1')
  t.ok(state.return.id == '1')
})

it('should not set variable if undefined', async ({ t }) => {
  const code = [
    '=result@db: user/create',
    '@return: $result'
  ].join('\n')
  const state = await weblang.init(code, {
    ext: { db: function({ set }){
      set('result', 'hello')
    } } })
  t.ok(state.vars.result == 'hello')
})