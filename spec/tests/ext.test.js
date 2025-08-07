var weblang = require('../../index.js')
var { db } = require('../lib/ext.js')

test('support custom extensions', async ({ t }) => {
  var code = '@db: user/create'
  var state = await weblang.init({ ext: { db } }).run(code)

  t.equal(state.vars.internal, 'hello')
})

test('set variable with extensions', async ({ t }) => {
  var code = ['=result@db: user/create', '@return: $result'].join('\n')
  var state = await weblang.init({ ext: { db } }).run(code)

  t.equal(state.vars.result.id, '1')
  t.equal(state.return.id, '1')
})

test('throw error if no returned tuple', async ({ t }) => {
  var hasError = false

  var db = function ({ set }) {
    set('result', 'hello')
  }

  var code = ['=result@db: user/create', '@return: $result'].join('\n')
  await weblang
    .init({ ext: { db } })
    .run(code)
    .catch(() => (hasError = true))

  t.equal(hasError, true)
})

test('delete a null variable', async ({ t }) => {
  var code = ['=hello: world', '=hello: null', '@delete: $hello'].join('\n')
  var state = await weblang.init().run(code)

  t.ok(state.vars.hello === undefined)
})

test('delete a null nested var', async ({ t }) => {
  var code = ['=param:', ' hello: world', '@delete: $param.hello'].join('\n')
  var state = await weblang.init().run(code)

  t.ok(state.vars.param !== undefined)
  t.ok(state.vars.param.hello === undefined)
})

test('delete a null nested index', async ({ t }) => {
  var code = ['=param:', ' list: [1, 2]', '@delete: $param.list[0]'].join('\n')
  var state = await weblang.init().run(code)

  t.ok(state.vars.param.list.length === 1)
  t.ok(state.vars.param.list[0] === 2)
})

test('delete a null nested index var', async ({ t }) => {
  var code = [
    '=list: ',
    ' - name: john',
    '   surname: smith',
    '@delete: $list[0].name',
  ].join('\n')
  var state = await weblang.init().run(code)

  t.ok(state.vars.list[0].name === undefined)
  t.ok(state.vars.list[0].surname === 'smith')
})
