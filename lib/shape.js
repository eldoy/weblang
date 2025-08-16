function isPojo(obj) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    Object.getPrototypeOf(obj) === Object.prototype
  )
}

function createNode(irtNode) {
  var [key, value] = Object.entries(irtNode)[0]

  var match = key.match(/^([=@]?)([^_]+)_ID_([as])-(\d+)-(\d+)-(\d+)_ID_$/)

  var [, prefix, part, flag, block, line, count] = match
  var raw = prefix == '@' ? prefix + part : part

  var mode = flag === 'a' ? 'async' : 'sync'

  var node = {
    id: `${flag}-${block}-${line}-${count}`,
    key: raw,
    value: value,
    mode: mode,
    block: parseInt(block),
    line: parseInt(line),
    count: parseInt(count),
    level: parseInt(line),
    parent: null,
    children: [],
  }

  return node
}

function shape(node) {
  node = node.id ? node : createNode(node)

  var value = node.value

  if (!isPojo(value)) return node

  for (var key in value) {
    if (key[0] == '@') {
      var clone = Object.assign({}, value)
      delete value[key]
      var child = createNode(clone)
      node.children.push(child)
      child.parent = node
      shape(child)
    }
  }

  return node
}

module.exports = shape
