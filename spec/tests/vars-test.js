let weblang = require('../../index.js')

it('should support custom vars', async ({ t }) => {
  let req = { pathname: '/hello' }
  let code = [
    '=req.pathname: /bye',
    '@return: $req.pathname'
  ].join('\n')
  let state = await weblang.init({
    vars: { req }
  }).run(code)

  t.ok(req.pathname == '/bye')
  t.ok(state.return == '/bye')
})


it('should reset vars between each run', async ({ t }) => {
  let instance = await weblang.init()

  let code1 = '=hello: 1'
  let state1 = await instance.run(code1)
  t.ok(state1.vars.hello == 1)

  let code2 = '=bye: 2'
  let state2 = await instance.run(code2)
  t.ok(typeof state2.vars.hello == 'undefined')
  t.ok(state2.vars.bye == 2)
})
