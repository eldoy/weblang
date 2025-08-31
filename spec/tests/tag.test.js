var tag = require('../../lib/tag.js')

test('tag - text', ({ t }) => {
  var data = 'hello'
  var result = tag('div', data)
  t.equal(result.tagName, 'div')
  t.equal(result.type, 'element')
  t.deepEqual(result.attributes, [])
  t.deepEqual(result.children, [
    {
      type: 'text',
      content: 'hello',
    },
  ])
})

test('tag - attributes', ({ t }) => {
  var data = { class: 'card', text: 'hello' }
  var result = tag('div', data)
  t.equal(result.tagName, 'div')
  t.equal(result.type, 'element')
  t.deepEqual(result.attributes, [
    {
      key: 'class',
      value: 'card',
    },
  ])
  t.deepEqual(result.children, [
    {
      type: 'text',
      content: 'hello',
    },
  ])
})
