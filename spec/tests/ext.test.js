var ext = require('../../lib/ext.js')
var compile = require('../../lib/compile.js')
var run = require('../../lib/run.js')

test('if', async ({ t }) => {
  var code = ['@if:', '  $hello:', '    is: string'].join('\n')
  var ast = compile(code)
  var opt = {
    ext: { if: ext.if },
    vars: { hello: 'world' },
  }
  var result = await run(ast, opt)
  t.equal(result.state.test, true)
})
