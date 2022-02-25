const weblang = require('../../index.js')

it('should support custom vars', async ({ t }) => {
  const req = { pathname: '/hello' }
  const state = await weblang({
    vars: { req }
  })([
    '$req.pathname: /bye',
    'return: $req.pathname'
  ].join('\n'))

  t.ok(req.pathname == '/bye')
  t.ok(state.return == '/bye')
})
