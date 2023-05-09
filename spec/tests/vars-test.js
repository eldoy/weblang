const weblang = require('../../index.js')

it('should support custom vars', async ({ t }) => {
  const req = { pathname: '/hello' }
  const code = [
    '=req.pathname: /bye',
    '@return: $req.pathname'
  ].join('\n')
  const state = await weblang.init({
    vars: { req }
  }).run(code)

  t.ok(req.pathname == '/bye')
  t.ok(state.return == '/bye')
})


it('should reset vars between each run', async ({ t }) => {
  const instance = await weblang.init()

  const code1 = '=hello: 1'
  const state1 = await instance.run(code1)
  t.ok(state1.vars.hello == 1)

  const code2 = '=bye: 2'
  const state2 = await instance.run(code2)
  t.ok(typeof state2.vars.hello == 'undefined')
  t.ok(state2.vars.bye == 2)
})
