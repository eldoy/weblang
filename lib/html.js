var parser = require('himalaya')

var html = { ext: {} }

html.ext.div = function ({ get, set, current }) {
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
  } else {
    // Possible approach on future task
    // var htmlContent = `<div>${input}</div>`
    // var contentParsed = parser.parse(htmlContent)
  }

  set('tags', result)
}

module.exports = html
