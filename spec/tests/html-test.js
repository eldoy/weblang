var weblang = require('../../index.js')
var { div } = require('../../lib/html.js')

test('simple div', async ({ t }) => {
  // String content
  var code = '@div: hello'
  var state = await weblang.init({ ext: { div } }).run(code)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].content, 'hello')
})
