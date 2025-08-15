// DFS post-order: children first, then parent.
// Iterative traversal with LIFO stack, works with objects and arrays.

function build(obj, callback) {
  var stack = [
    {
      node: obj,
      keys: Object.keys(obj).reverse(),
      parent: null,
      ready: false,
      key: null,
    },
  ]

  while (stack.length) {
    var top = stack[stack.length - 1]
    var { node, keys } = top

    if (!top.ready && keys.length) {
      var key = keys.pop()
      var value = node[key]

      if (value && typeof value === 'object') {
        if (Array.isArray(value)) {
          // Push the array itself to execute callback after its children
          stack.push({ node: value, keys: [], parent: top, ready: true, key })

          // Push array elements in reverse order
          for (var i = value.length - 1; i >= 0; i--) {
            if (value[i] && typeof value[i] === 'object') {
              stack.push({
                node: value[i],
                keys: Object.keys(value[i]).reverse(),
                parent: top,
                ready: false,
                key: null,
              })
            }
          }
        } else {
          // Object: push to stack to process its keys first
          stack.push({
            node: value,
            keys: Object.keys(value).reverse(),
            parent: top,
            ready: false,
            key,
          })
        }
      } else {
        // Leaf node: execute callback immediately
        callback(key, value)
      }
    } else {
      // Node is ready: all children processed, now execute callback on the parent node
      stack.pop()
      if (top.key) callback(top.key, top.node)
    }
  }
}

module.exports = build
