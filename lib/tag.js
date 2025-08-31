function tag(name, data) {
  if (typeof data == 'string') {
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

  return { name, type: 'element', attributes, text }
}

module.exports = tag
