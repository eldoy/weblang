var weblang = require('../../index.js')
var { div, p } = require('../../lib/html.js')

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

  t.equal(state.vars.previousLevel, 0)
  t.equal(state.vars.currentLevel, 1)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].type, 'element')
  t.equal(state.vars.tags[0].children[0].tagName, 'div')
  t.equal(state.vars.tags[0].children[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].children[0].content, 'hello')
})

test('empty object', async ({ t }) => {
  var code = '@div: {}'
  var state = await weblang.init({ ext: { div } }).run(code)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].attributes.length, 0)
  t.equal(state.vars.tags[0].children.length, 0)
})

test('null value', async ({ t }) => {
  var code = '@div: null'
  var state = await weblang.init({ ext: { div } }).run(code)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].attributes.length, 0)
  t.equal(state.vars.tags[0].children.length, 0)
})

test('number value', async ({ t }) => {
  var code = '@div: 5'
  var state = await weblang.init({ ext: { div } }).run(code)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].attributes.length, 0)
  t.equal(state.vars.tags[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].content, 5)
})

test('boolean value', async ({ t }) => {
  var code = '@div: true'
  var state = await weblang.init({ ext: { div } }).run(code)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].attributes.length, 0)
  t.equal(state.vars.tags[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].content, true)
})

test('variable value', async ({ t }) => {
  var code = ['=hello: world', '@div: $hello'].join('\n')
  var state = await weblang.init({ ext: { div } }).run(code)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].attributes.length, 0)
  t.equal(state.vars.tags[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].content, 'world')
})

test('variable text value', async ({ t }) => {
  var code = ['=hello: world', '@div:', ' text: $hello'].join('\n')
  var state = await weblang.init({ ext: { div } }).run(code)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].attributes.length, 0)
  t.equal(state.vars.tags[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].content, 'world')
})

test('nested with attributes', async ({ t }) => {
  var code = [
    '@div:',
    ' class: a',
    ' text: hello',
    ' @div:',
    '  class: a',
    '  text: bye'
  ].join('\n')
  var state = await weblang.init({ ext: { div } }).run(code)

  t.equal(state.vars.previousLevel, 0)
  t.equal(state.vars.currentLevel, 1)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].children.length, 2)
  t.equal(state.vars.tags[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].content, 'hello')
  t.equal(state.vars.tags[0].attributes.length, 1)
  t.equal(state.vars.tags[0].attributes[0].key, 'class')
  t.equal(state.vars.tags[0].attributes[0].value, 'a')

  t.equal(state.vars.tags[0].children[1].type, 'element')
  t.equal(state.vars.tags[0].children[1].tagName, 'div')
  t.equal(state.vars.tags[0].children[1].children.length, 1)
  t.equal(state.vars.tags[0].children[1].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[1].children[0].content, 'bye')
  t.equal(state.vars.tags[0].children[1].attributes.length, 1)
  t.equal(state.vars.tags[0].children[1].attributes[0].key, 'class')
  t.equal(state.vars.tags[0].children[1].attributes[0].value, 'a')
})

test('nested obj with attributes', async ({ t }) => {
  var code = '@div: { class: a, text: hello, @div: { class: a, text: bye }  }'
  var state = await weblang.init({ ext: { div } }).run(code)

  t.equal(state.vars.previousLevel, 0)
  t.equal(state.vars.currentLevel, 1)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].children.length, 2)
  t.equal(state.vars.tags[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].content, 'hello')
  t.equal(state.vars.tags[0].attributes.length, 1)
  t.equal(state.vars.tags[0].attributes[0].key, 'class')
  t.equal(state.vars.tags[0].attributes[0].value, 'a')

  t.equal(state.vars.tags[0].children[1].type, 'element')
  t.equal(state.vars.tags[0].children[1].tagName, 'div')
  t.equal(state.vars.tags[0].children[1].children.length, 1)
  t.equal(state.vars.tags[0].children[1].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[1].children[0].content, 'bye')
  t.equal(state.vars.tags[0].children[1].attributes.length, 1)
  t.equal(state.vars.tags[0].children[1].attributes[0].key, 'class')
  t.equal(state.vars.tags[0].children[1].attributes[0].value, 'a')
})

test('simple paragraph', async ({ t }) => {
  var code = '@p: hello'
  var state = await weblang.init({ ext: { p } }).run(code)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'p')
  t.equal(state.vars.tags[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].content, 'hello')
})

test('simple div, paragraph', async ({ t }) => {
  var code = ['@div: hello', '@p: bye'].join('\n')
  var state = await weblang.init({ ext: { div, p } }).run(code)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].children.length, 1)
  t.equal(state.vars.tags[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].content, 'hello')

  t.equal(state.vars.tags[1].type, 'element')
  t.equal(state.vars.tags[1].tagName, 'p')
  t.equal(state.vars.tags[1].children.length, 1)
  t.equal(state.vars.tags[1].children[0].type, 'text')
  t.equal(state.vars.tags[1].children[0].content, 'bye')
})

test('nested div, paragraph', async ({ t }) => {
  var code = ['@div:', ' text: hello', ' @p: bye'].join('\n')
  var state = await weblang.init({ ext: { div, p } }).run(code)

  t.equal(state.vars.tags[0].type, 'element')
  t.equal(state.vars.tags[0].tagName, 'div')
  t.equal(state.vars.tags[0].children.length, 2)
  t.equal(state.vars.tags[0].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[0].content, 'hello')

  t.equal(state.vars.tags[0].children[1].type, 'element')
  t.equal(state.vars.tags[0].children[1].tagName, 'p')
  t.equal(state.vars.tags[0].children[1].children.length, 1)
  t.equal(state.vars.tags[0].children[1].children[0].type, 'text')
  t.equal(state.vars.tags[0].children[1].children[0].content, 'bye')
})
