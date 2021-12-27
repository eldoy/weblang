const _ = require('lodash')
const yaml = require('js-yaml')
const { validate, i18n, locales: DEFAULT_LOCALES } = require('waveorb')

module.exports = async function($) {
  console.log('CMSJS')

  const site = $.site
  if (!site) {
    throw Error('site not found')
  }

  const action = await $.db('action').get({ name: $.action })
  if (!action) {
    throw Error('action not found')
  }
  console.log({ site })
  console.log({ action })

  // Add locales
  console.log({ lang: $.lang })
  const locale = await $.db('locale').get({
    site_id: $.site.id,
    name: $.lang
  })

  console.log({ locale })

  if (locale) {
    const localeData = yaml.load(locale.data, { json: true })
    const locales = _.merge({}, DEFAULT_LOCALES, { [locale.name]: localeData })
    console.log({ locales })
    $.t = i18n.t({ lang: $.lang, locales })
  }

  const {
    query = {},
    values = {},
    fields = {},
    sort = { created_at: -1 },
    skip,
    limit
  } = $.params

  const options = { fields, sort, skip, limit }

  function getDatabaseArgs(verb) {
    // find: query, options
    // get: query, options
    // count: query, options
    // create: values
    // update: query, values
    // delete: query
    if (verb == 'create') {
      return [values]
    } else if (verb == 'update') {
      return [query, values]
    } else if (verb == 'delete') {
      return [query]
    }
    return [query, options]
  }

  const state = {
    var: {},
    return: {}
  }

  console.log(JSON.stringify(state, null, 2))

  async function run(code) {

    for (const name in code) {
      const val = code[name]
      const key = name.split('@')[0]

      if (key == 'filters') {
        // OPTIMIZE: Prefetch or cache these
        // Only fetch data, or store as object in action
        const filters = await $.db('filter').find({ name: { $in: val } })
        for (const filter of filters) {
          const filterCode = yaml.load(filter.data, { json: true })
          await run(filterCode)
        }
      }

      if (key == 'allow') {
        await $.allow(val)
      }

      if (key == 'deny') {
        await $.deny(val)
      }

      if (key == 'validate') {
        await $.validate(val)
      }

      if (key == 'set') {
        for (const k in val) {
          const v = val[k]
          state.var[k] = v
        }
      }

      if (key == 'if') {
        const name = Object.keys(val)[0]
        const data = state.var[name]
        const spec = val[name]
        state.test = !(await validate(spec, data))
      }

      if (key == 'then' && state.test === true) {
        await run(val)
        delete state.test
      }

      if (key == 'else' && state.test === false) {
        await run(val)
        delete state.test
      }

      if (key == 'db') {
        let { path, set } = val
        console.log({ path, set })
        let [model, verb] = path.split('/')
        const args = getDatabaseArgs(verb)
        console.log('ARGS:', ...args)
        const method = $.db(model)[verb]
        const result = await method(...args)
        if (set) {
          state.var[set] = result
        }
      }

      if (key == 'mail') {
        const { name } = val
        let email = await $.db('email').get({ name })
        if (email) {
          const emailCode = yaml.load(email.data, { json: true })
          email = _.merge(email, emailCode)
        }
        email = _.merge(email, { to, from, subject, content } = val)
        console.log({ email })
        email.layout = 'mail'
        $.mailer.send(email, $, { })
      }

      if (key == 'keep' || key == 'remove') {
        const name = Object.keys(val)[0]
        const obj = state.var[name]
        if (obj) {
          await $[key](obj, val[name])
        }
      }

      if (key == 'return') {

        if (_.isPlainObject(val)) {
          for (const k in val) {
            const v = val[k]
            console.log({ k, v })
            val[k] = state.var[v] || v
          }
          return val
        }

        return state.var[val] || val
      }
    }
  }

  const code = yaml.load(action.data, { json: true })
  console.log(code)

  console.log(JSON.stringify(state, null, 2))

  console.log({ return: state.return })

  return await run(code) || {}
}

