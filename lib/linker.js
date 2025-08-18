function linker(node) {
  if (!node) return null

  // If the node has children, iterate over them
  if (node.children && node.children.length > 0) {
    var children = node.children

    for (var i = 0; i < children.length; i++) {
      var child = children[i]

      // Assign siblings, index, previous and next
      child.siblings = children
      child.index = i
      child.previous = children[i - 1] || null
      child.next = children[i + 1] || null

      // Recursively link the child's children
      linker(child)
    }
  }

  // Initialize fields for nodes without parent or siblings
  if (!node.siblings) node.siblings = []
  if (node.index === undefined) node.index = 0
  if (node.previous === undefined) node.previous = null
  if (node.next === undefined) node.next = null

  return node
}

module.exports = linker
