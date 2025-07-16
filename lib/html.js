var parser = require('himalaya')

var html = {}

html.div = async function ({ get, set, run, val, state, current }) {
  if (state.vars.currentLevel == null) {
    state.vars.currentLevel = 0
  }
  if (state.vars.previousLevel == null) {
    state.vars.previousLevel = 0
  }

  function buildPath(withDollar) {
    var path = withDollar ? '$tags[0]' : 'tags[0]'

    if (state.vars.currentLevel === 0) return withDollar ? '$tags' : 'tags'

    for (var i = 0; i < state.vars.currentLevel; i++) {
      path += i === 0 ? '.children' : '[0].children'
    }

    return path
  }

  var tags = get(buildPath(true)) || []

  var element = {
    type: 'element',
    tagName: 'div',
    attributes: [],
    children: []
  }

  var content = ''
  var hasChild = false
  if (typeof current == 'string') {
    content = current
  } else {
    for (var key in current) {
      if (key == 'text') {
        content = current[key]
      } else if (key.startsWith('@div')) {
        hasChild = true
      } else {
        element.attributes.push({ key, value: current[key] })
      }
    }
  }

  if (content) {
    element.children.push({ type: 'text', content })
  }

  tags.push(element)
  set(buildPath(false), tags)

  if (hasChild) {
    state.vars.previousLevel = state.vars.currentLevel
    state.vars.currentLevel++
    await run(val)
  }
}

module.exports = html
