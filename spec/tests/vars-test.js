var weblang = require('../../index.js')

it('should support custom vars', async ({ t }) => {
  var req = { pathname: '/hello' }
  var code = [
    '=req.pathname: /bye',
    '@return: $req.pathname'
  ].join('\n')
  var state = await weblang.init({
    vars: { req }
  }).run(code)

  t.ok(req.pathname == '/bye')
  t.ok(state.return == '/bye')
})


it('should reset vars between each run', async ({ t }) => {
  var instance = await weblang.init()

  var code1 = '=hello: 1'
  var state1 = await instance.run(code1)
  t.ok(state1.vars.hello == 1)

  var code2 = '=bye: 2'
  var state2 = await instance.run(code2)
  t.ok(typeof state2.vars.hello == 'undefined')
  t.ok(state2.vars.bye == 2)
})
