var parser = require('himalaya')

var html = {}

html.div = function ({ get, set, current }) {
  var result = []
  var input = get(current)

  if (typeof input == 'string') {
    result = [
      {
        type: 'element',
        tagName: 'div',
        children: [{ type: 'text', content: input }]
      }
    ]
  }

  set('tags', result)
}

module.exports = html
