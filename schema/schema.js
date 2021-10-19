const action = function($) {
  await $.filters(['setup', 'auth'])
  await $.validate({
    values: {
      name: {
        minlength: 2
      },
      email: {
        is: $email
      }
    }
  })
  const { values = {} } = $.params
  await $.allow(values, ['name', 'email'])
  values.user_id = $user.id
  values.password = $.encrypt(values.password)

  // or
  set({
    values: {
      user_id: $user.id,
      password: $.encrypt(values.password)
    }
  })

  // multiple set
  if($user == 'vidar@eldoy.com') {
    values.published = true

    // or
    set({ values: { published: true } })
  }

  $.mail('signup', { values })

  // or define directly here
  $.mail(
    to: '$user,
    html: `
      Welcome! This is the shit.

      Are you ready? {{email}}
    `
  )

  let result = await $.db('user').create($.params.values)
  await $.keep(result, ['id'])
  return result
}

const form = {
  action: 'user/create',
  name: {
    type: 'string',
    blank: true // can be blank
  },
  email: {
    type: 'string'
  }
}