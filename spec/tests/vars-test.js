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
