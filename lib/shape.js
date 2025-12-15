var operator = require('./operator.js')
var lodash = require('lodash')

var matcher = /^([=@]?)([^_]+)_ID_([as])-(\d+)-(\d+)-(\d+)-(\d+)_ID_$/

function createNode(irtNode) {
  var [key, value] = Object.entries(irtNode)[0]

  var match = key.match(matcher)
  if (!match) return null

  var [, prefix, part, flag, block, line, column, hit] = match
  key = prefix === '@' ? prefix + part : part

  var id = `${flag}-${block}-${line}-${column}-${hit}`

  var mode = flag === 'a' ? 'async' : 'sync'

  var operation = operator(key)

  var node = {
    id,
    key,
    value,
    mode,
    block: parseInt(block),
    line: parseInt(line),
    column: parseInt(column),
    hit: parseInt(hit),
    parent: null,
    children: [],
    operation
  }

  return node
}

function shape(node) {
  if (!node.id) node = createNode(node)
  if (node === null) return null

  var value = node.value

  if (!lodash.isPlainObject(value)) return node

  for (var key in value) {
    if (key[0] === '@' || key[0] === '=') {
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
