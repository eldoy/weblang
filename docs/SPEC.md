### WEBLANG DSL

Features:
- Minimal, easy to learn
- Secure
- Dot notation
- Declarative, not nested, line by line
- Returns last line

.wlang files could look like this:

```js
filters('setup', 'authenticate', 'login')
if (!user) $tags = db.tags.find({ published: true })
if (user) $tags = db.tags.find()

validate({
  query: {
    name: {
      gt: 1
    }
  },
  values: {
    tag: {
      in: $tags
    }
  }
})
```

```ruby
filters(setup, authenticate, login)
tags = db.tags.find(published: true) if !user
tags = db.tags.find if user

validate(query.name.gt: 1)
validate(values.tag.in: tags) if user.id

allow(title, name) in params.values
deny(title, name) in params.values

params.values.user_id = user.id if user.id

password = encrypt(params.values.password)
params.values.password = password
params.values.current = null

mail.signup(to: result.email) if result
result = db.user.create(params.values)

remove(title, user.name) in result
keep(title, description) in result

result
```

```ruby
filters(setup, authenticate, login)
tags = db.tags.find(published: true) if not user
tags = db.tags.find if user

validate(
  query.name.gt: 1,
  values.tag.in: tags if user.id
)

allow(
  values.title,
  values.name,
  values.email if not user.email has 'vidar@eldoy.com'
  values.notify if user.email is 'vidar@eldoy.com'
)

deny(
  values.title,
  values.name
)

params.values.user_id = user.id if user.id
password = encrypt(params.values.password)

params.values.password = password
params.values.current = undefined

mail.signup(to: result.email) if result
result = db.user.create(params.values)

remove(
  result.title,
  result.user.name
)

keep(
  result.title,
  result.description
)

result
```

For an app, we can also do:

filters
  setup
  auth
  user

allow
  query
    id
  values
    name

deny
  query
    link
  values
    email

validate
  query
    email
      required true
      is $email
  values

set
  query
    // Set from variable
    user_id user.id
  values
    // Run function on variable
    password | encrypt

    // Run function on variable
    password | encrypt salt: true with options

    // Set as string
    hello 'bye'

    // Set from variable function
    hello date

db
  create
    user

on
  create
    mail
      signup
        to values.email

keep
  result
    name

remove
  result
    name

upload config can be sent from browser?
what do we do about emails?

do we even need if?

events?
  oncreate
  onupdate
  ondelete

// Declarative style, line by line

For an app, we can also do:

filters setup auth user

allow query id
allow values name

deny query link
deny values email

validate query email required: true is: $email
validate query email

set query user_id user.id
set values password | encrypt
set values password | encrypt salt: true
set values hello 'bye'
set values hello date

db create user

on create mail signup to: values.email

keep result name
remove result name


// Ruby version DECLARATIVE, convert to js with Opal

filter setup
filter auth
filter user
allow query.id
allow values.name
validate query.email

      required: true
      is: '$email'
    }
  }
)
set(
  query: {
    user_id: user.id
  },
  values: {
    password: encrypt(values.password)
    password: encrypt(salt: true),
    hello: 'bye',
    hello: date
  }
)

filters setup auth user

allow query id
allow values name

deny query link
deny values email

validate query email required: true is: $email
validate query email

set query user_id user.id
set values password | encrypt
set values password | encrypt salt: true
set values hello 'bye'
set values hello date

db create user

on create mail signup to: values.email

keep result name
remove result name


// YML version

filters:
  - auth
  - user

allow:
  query:
    - id
  values:
    - name

validate:
  query:
    id:
      - required: true
      - is: $id
  values:
    email:
      - is: $email

set:
  query:
    user_id: user.id
  values:
    password: encrypt
    password:
      encrypt:
        salt: true
    hello: bye
    hello: date

db:
  user:
    create

mail:
  signup:
    to: values.email

keep:
  result:
    - name
remove:
  result:
    - id
