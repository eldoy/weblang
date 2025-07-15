var weblang = require('../../index.js')
var { div } = require('../lib/ext.js')

test('simple div', async ({ t }) => {
  var expectedTags = [
    {
      type: 'element',
      tagName: 'div',
      attributes: [],
      children: [{ type: 'text', content: 'hello' }]
    }
  ]

  // String content
  var code = ['@div:', ' hello'].join('\n')
  var state = await weblang.init({ ext: { div } }).run(code)

  t.deepEqual(state, { vars: { tags: expectedTags } })

  // Variable content
  var code = ['=myVar: hello', '@div:', ' $myVar'].join('\n')
  var state = await weblang.init({ ext: { div } }).run(code)

  t.deepEqual(state, { vars: { myVar: 'hello', tags: expectedTags } })
})
