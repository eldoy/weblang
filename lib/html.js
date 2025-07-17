var parser = require('himalaya')

var html = {}

async function simpleTag({
  get,
  set,
  run,
  val,
  ext,
  currentLevel,
  tagLevels,
  current
}) {
  var previousLevel = tagLevels[tagLevels.length - 1]
  var siblingIndex = 0

  for (var i = tagLevels.length - 1; i >= 0; i--) {
    var level = tagLevels[i]
    if (level === previousLevel) {
      siblingIndex++
    } else if (level < previousLevel) {
      break
    }
  }

  var parentTagLevel = 0
  for (var i = 0; i <= tagLevels.length - 1; i++) {
    var level = tagLevels[i]
    if (level === 0) {
      parentTagLevel++
    }
  }

  tagLevels.push(currentLevel)

  var tagsPath = 'tags'
  if (currentLevel > 0) {
    var path = `tags[${parentTagLevel < 0 ? 0 : parentTagLevel - 1}]`

    for (var i = 0; i < currentLevel; i++) {
      if (i === 0) {
        path += '.children'
      } else if (i === currentLevel - 1) {
        path += `[${siblingIndex - 1}].children`
      } else {
        path += '[0].children'
      }
    }

    tagsPath = path
  }

  var tags = get('$' + tagsPath) || []

  var element = {
    type: 'element',
    tagName: ext,
    attributes: [],
    children: []
  }

  var content = ''
  var hasChild = false
  if (['string', 'number', 'boolean'].includes(typeof current)) {
    content = get(current)
  } else {
    for (var key in current) {
      if (key == 'text') {
        content = get(current[key])
      } else if (key.startsWith('@')) {
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
  set(tagsPath, tags)

  if (hasChild) {
    await run(val, currentLevel + 1)
  }
}

html.div = simpleTag
html.p = simpleTag

module.exports = html
