var tag = require('../../lib/tag.js')

test('tag - text', ({ t }) => {
  var data = 'hello'
  var result = tag('div', data)
  t.equal(result.type, 'element')
  t.equal(result.name, 'div')
  t.equal(result.text, 'hello')
  t.deepEqual(result.attributes, [])
})

test('tag - attributes', ({ t }) => {
  var data = { class: 'card', text: 'hello' }
  var result = tag('div', data)
  t.equal(result.type, 'element')
  t.equal(result.name, 'div')
  t.equal(result.text, 'hello')
  t.deepEqual(result.attributes, [
    {
      key: 'class',
      value: 'card',
    },
  ])
})
