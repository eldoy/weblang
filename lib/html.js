var parser = require('himalaya')

var html = {}

async function simpleTag({ get, set, run, val, ext, currentLevel, current }) {
  var levelPathMap = get('$levelPathMap') || []
  var parentPath = currentLevel > 0 ? levelPathMap[currentLevel - 1] : null
  var newElementPath

  if (parentPath) {
    var siblings = get('$' + parentPath + '.children') || []
    newElementPath = `${parentPath}.children[${siblings.length}]`
  } else {
    var rootTags = get('$tags') || []
    newElementPath = `tags[${rootTags.length}]`
  }

  var element = {
    type: 'element',
    tagName: ext,
    attributes: [],
    children: []
  }

  var hasChild = false

  if (
    typeof current === 'string' ||
    typeof current === 'number' ||
    typeof current === 'boolean'
  ) {
    element.children.push({ type: 'text', content: get(current) })
  } else if (current && typeof current === 'object') {
    for (var key in current) {
      if (key === 'text') {
        element.children.push({ type: 'text', content: get(current[key]) })
      } else if (key.startsWith('@')) {
        hasChild = true
      } else {
        element.attributes.push({ key, value: current[key] })
      }
    }
  }

  set(newElementPath, element)
  levelPathMap[currentLevel] = newElementPath
  levelPathMap.length = currentLevel + 1
  set('levelPathMap', levelPathMap)

  if (hasChild) await run(val, currentLevel + 1)
}

html.div = simpleTag
html.p = simpleTag

module.exports = html
