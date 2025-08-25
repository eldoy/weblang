var piper = require('./piper.js')
var operator = require('./operator.js')

var matcher = /^([=@]?)([^_]+)_ID_([as])-(\d+)-(\d+)-(\d+)_ID_$/

function isObject(value) {
  return !(
    typeof value != 'object' ||
    value == null ||
    Object.getPrototypeOf(value) != Object.prototype
  )
}

function createNode(irtNode) {
  var [key, value] = Object.entries(irtNode)[0]

  var match = key.match(matcher)
  if (!match) return null

  var [, prefix, part, flag, block, line, column] = match
  key = prefix == '@' ? prefix + part : part

  var id = `${flag}-${block}-${line}-${column}`

  if (!isObject(value)) {
    var args = value
  } else {
    var args = Object.assign({}, value)
    for (var k in args) {
      if (k[0] == '@') {
        delete args[k]
      }
    }
  }

  var operations = operator(key, args)

  var mode = flag == 'a' ? 'async' : 'sync'

  var node = {
    id,
    key,
    value,
    mode,
    block: parseInt(block),
    line: parseInt(line),
    column: parseInt(column),
    level: parseInt(line),
    parent: null,
    children: [],
    operations,
  }

  return node
}

function shape(node) {
  if (!node.id) node = createNode(node)
  if (node === null) return null

  var value = node.value

  if (!isObject(value)) return node

  for (var key in value) {
    if (key[0] == '@') {
      var args = value[key]
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
