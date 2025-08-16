function createNode(irtNode) {
  var [key, value] = Object.entries(irtNode)[0]

  var match = key.match(/^([=@]?)([^_]+)_ID_([as])-(\d+)-(\d+)-(\d+)_ID_$/)
  if (!match) return null

  var [, prefix, part, flag, block, line, hit] = match
  var raw = prefix == '@' ? prefix + part : part

  var mode = flag == 'a' ? 'async' : 'sync'

  var node = {
    id: `${flag}-${block}-${line}-${hit}`,
    key: raw,
    value: value,
    mode: mode,
    block: parseInt(block),
    line: parseInt(line),
    hit: parseInt(hit),
    level: parseInt(line),
    parent: null,
    children: [],
  }

  return node
}

function shape(node) {
  if (!node.id) node = createNode(node)
  if (node === null) return null

  var value = node.value

  // Return if value isn't POJO
  if (
    typeof value != 'object' ||
    value == null ||
    Object.getPrototypeOf(value) != Object.prototype
  ) {
    return node
  }

  for (var key in value) {
    if (key[0] == '@') {
      var child = createNode({ [key]: value[key] })
      delete value[key]
      child.parent = node
      shape(child)
      node.children.push(child)
    }
  }

  return node
}

module.exports = shape
