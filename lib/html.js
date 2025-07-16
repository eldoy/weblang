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
        attributes: [],
        children: [{ type: 'text', content: input }]
      }
    ]
  } else {
    var content = input?.text ?? ''
    var attributes = []

    for (var [key, rawValue] of Object.entries(input)) {
      if (key === 'text' || key.startsWith('@') || key.startsWith('=')) {
        continue
      }

      var resolvedValue = get(rawValue)
      var hasValue = resolvedValue !== undefined && resolvedValue !== null

      if (hasValue) attributes.push({ key, value: resolvedValue })
    }

    result = [
      {
        type: 'element',
        tagName: 'div',
        attributes,
        children: [{ type: 'text', content }]
      }
    ]
  }

  var tags = get('$tags') ?? []
  set('tags', [...tags, ...result])
}

module.exports = html
