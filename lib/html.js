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

html.a = simpleTag
html.abbr = simpleTag
html.address = simpleTag
html.area = simpleTag
html.article = simpleTag
html.aside = simpleTag
html.audio = simpleTag
html.b = simpleTag
html.base = simpleTag
html.bdi = simpleTag
html.bdo = simpleTag
html.blockquote = simpleTag
html.body = simpleTag
html.br = simpleTag
html.button = simpleTag
html.canvas = simpleTag
html.caption = simpleTag
html.cite = simpleTag
html.code = simpleTag
html.col = simpleTag
html.colgroup = simpleTag
html.data = simpleTag
html.datalist = simpleTag
html.dd = simpleTag
html.del = simpleTag
html.details = simpleTag
html.dfn = simpleTag
html.dialog = simpleTag
html.div = simpleTag
html.dl = simpleTag
html.dt = simpleTag
html.em = simpleTag
html.embed = simpleTag
html.fieldset = simpleTag
html.figcaption = simpleTag
html.figure = simpleTag
html.footer = simpleTag
html.form = simpleTag
html.h1 = simpleTag
html.h2 = simpleTag
html.h3 = simpleTag
html.h4 = simpleTag
html.h5 = simpleTag
html.h6 = simpleTag
html.head = simpleTag
html.header = simpleTag
html.hgroup = simpleTag
html.hr = simpleTag
html.html = simpleTag
html.i = simpleTag
html.iframe = simpleTag
html.img = simpleTag
html.input = simpleTag
html.ins = simpleTag
html.kbd = simpleTag
html.label = simpleTag
html.legend = simpleTag
html.li = simpleTag
html.link = simpleTag
html.main = simpleTag
html.map = simpleTag
html.mark = simpleTag
html.meta = simpleTag
html.meter = simpleTag
html.nav = simpleTag
html.noscript = simpleTag
html.object = simpleTag
html.ol = simpleTag
html.optgroup = simpleTag
html.option = simpleTag
html.output = simpleTag
html.p = simpleTag
html.param = simpleTag
html.picture = simpleTag
html.pre = simpleTag
html.progress = simpleTag
html.q = simpleTag
html.rb = simpleTag
html.rp = simpleTag
html.rt = simpleTag
html.rtc = simpleTag
html.ruby = simpleTag
html.s = simpleTag
html.samp = simpleTag
html.script = simpleTag
html.section = simpleTag
html.select = simpleTag
html.slot = simpleTag
html.small = simpleTag
html.source = simpleTag
html.span = simpleTag
html.strong = simpleTag
html.style = simpleTag
html.sub = simpleTag
html.summary = simpleTag
html.sup = simpleTag
html.table = simpleTag
html.tbody = simpleTag
html.td = simpleTag
html.template = simpleTag
html.textarea = simpleTag
html.tfoot = simpleTag
html.th = simpleTag
html.thead = simpleTag
html.time = simpleTag
html.title = simpleTag
html.tr = simpleTag
html.track = simpleTag
html.u = simpleTag
html.ul = simpleTag
html.var = simpleTag
html.video = simpleTag
html.wbr = simpleTag

module.exports = html
