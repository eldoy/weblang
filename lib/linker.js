function linker(ast, scopeid = 1) {
  if (!Array.isArray(ast) || !ast.length) {
    return []
  }

  for (var i = 0; i < ast.length; i++) {
    var node = ast[i]
    node.index = i
    node.siblings = ast

    for (var n of node.siblings) {
      n.scopeid = scopeid++
    }

    node.next = ast[i + 1] || null
    node.previous = ast[i - 1] || null

    if (node.children.length) {
      linker(node.children, scopeid)
    }
  }

  return ast
}

module.exports = linker
