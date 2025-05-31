var weblang = require('../../index.js')
var { db } = require('../lib/ext.js')

it('should support custom extensions', async ({ t }) => {
  var code = '@db: user/create'
  var state = await weblang.init({ ext: { db } }).run(code)
  t.ok(state.vars.internal == 'hello')
})

it('should set variable with extensions', async ({ t }) => {
  var code = [
    '=result@db: user/create',
    '@return: $result'
  ].join('\n')
  var state = await weblang.init({ ext: { db } }).run(code)
  t.ok(state.vars.result.id == '1')
  t.ok(state.return.id == '1')
})

it('should not set variable if undefined', async ({ t }) => {
  var code = [
    '=result@db: user/create',
    '@return: $result'
  ].join('\n')
  var state = await weblang.init({
    ext: { db: function({ set }){
      set('result', 'hello')
    } } }).run(code)
  t.ok(state.vars.result == 'hello')
})