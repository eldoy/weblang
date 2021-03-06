const weblang = require('../../index.js')

const db = function({ state, key, val, set, get }) {
  set('$internal', 'hello')
  return { id: '1' }
}

it('should support custom extensions', async ({ t }) => {
  const state = await weblang({
    ext: { db }
  })([
    '@db: user/create'
  ].join('\n'))
  t.ok(state.vars.internal == 'hello')
})

it('should set variable with extensions', async ({ t }) => {
  const state = await weblang({
    ext: { db }
  })([
    '@db$result: user/create',
    '@return: $result'
  ].join('\n'))
  t.ok(state.vars.result.id == '1')
  t.ok(state.return.id == '1')
})

it('should not set variable if undefined', async ({ t }) => {
  const state = await weblang({
    ext: { db: function({ set }){
      set('result', 'hello')
    } }
  })([
    '@db$result: user/create',
    '@return: $result'
  ].join('\n'))
  t.ok(state.vars.result == 'hello')
})