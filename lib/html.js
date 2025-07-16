var parser = require('himalaya')

var html = {}

html.div = function ({ get, set, current }) {
  var tags = get('$tags') || []
  var element = {
    type: 'element',
    tagName: 'div',
    attributes: [],
    children: []
  }

  var content = ''
  if (typeof current == 'string') {
    content = current
  } else {
    for (var key in current) {
      if (key == 'text') {
        content = current[key]
      } else {
        element.attributes.push({ key, value: current[key] })
      }
    }
  }

  if (content) {
    element.children.push({ type: 'text', content })
  }

  tags.push(element)
  set('tags', tags)
}

module.exports = html
