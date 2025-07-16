var weblang = require('../../index.js')
var { div } = require('../../lib/html.js')

test('simple div', async ({ t }) => {
  var code = '@div: hello'
  var state = await weblang.init({ ext: { div } }).run(code)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].content, 'hello')
})

test('multi div', async ({ t }) => {
  var code = ['@div: hello', '@div: bye'].join('\n')
  var state = await weblang.init({ ext: { div } }).run(code)

  t.equal(state.vars.tags.length, 2)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].content, 'hello')

  t.equal(state.vars.tags[1].type, 'element')
  t.equal(state.vars.tags[1].tagName, 'div')
  t.equal(state.vars.tags[1].children.length, 1)
  t.equal(state.vars.tags[1].children[0].type, 'text')
  t.equal(state.vars.tags[1].children[0].content, 'bye')
})

test('simple attributes', async ({ t }) => {
  var code = '@div: { id: 123, class: hello, text: bye }'
  var state = await weblang.init({ ext: { div } }).run(code)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')

  t.equal(state.vars.tags[0].attributes.length, 2)
  t.equal(state.vars.tags[0].attributes[0].key, 'id')
  t.equal(state.vars.tags[0].attributes[0].value, '123')
  t.equal(state.vars.tags[0].attributes[1].key, 'class')
  t.equal(state.vars.tags[0].attributes[1].value, 'hello')

  t.equal(state.vars.tags[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].content, 'bye')
})

test('simple nested', async ({ t }) => {
  var code = ['@div:', ' @div: hello'].join('\n')
  var state = await weblang.init({ ext: { div } }).run(code)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].type, 'element')
  t.equal(state.vars.tags[0].children[0].tagName, 'div')
  t.equal(state.vars.tags[0].children[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].children[0].content, 'hello')
})
