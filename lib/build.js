var shape = require('./shape.js')

function build(obj, callback = shape) {
  var result = null

  var stack = [
    {
      node: obj,
      keys: Object.keys(obj),
      key: null,
      parentShape: null, // reference to parent shaped object
    },
  ]

  while (stack.length) {
    var top = stack.pop()
    var { node, keys, key, parentShape } = top

    if (key !== null && isNaN(Number(key))) {
      var shaped = callback(key)
      if (shaped) {
        if (typeof node === 'string') {
          shaped.value = node
        }

        // If parentShape exists and key starts with '@', add to parent's children
        if (parentShape && key.startsWith('@')) {
          parentShape.children.push(shaped)
        }

        // If result is null, assign first shaped as root
        if (!result) result = shaped

        // Pass shaped as parent to children
        var currentShape = shaped
      }
    }

    for (var i = keys.length - 1; i >= 0; i--) {
      var childKey = keys[i]
      var value = node[childKey]

      stack.push({
        node: value,
        keys:
          typeof value === 'object' && value !== null ? Object.keys(value) : [],
        key: childKey,
        parentShape: currentShape || parentShape, // pass current shaped as parent
      })
    }
  }

  return result
}

module.exports = build
