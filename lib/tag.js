function tag(name, data) {
  if (typeof data === 'string') {
    data = { text: data }
  }
  data = Object.assign({}, data)

  var text = data.text || ''
  delete data.text

  var attributes = []
  for (var key in data) {
    var value = data[key]
    attributes.push({ key, value })
  }

  var children = [{ type: 'text', content: text }]

  return {
    tagName: name,
    type: 'element',
    attributes,
    children
  }
}

module.exports = tag
