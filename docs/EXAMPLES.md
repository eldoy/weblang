DB and HTML example

```yml
@route:
  name: home
  paths:
    - url: /
      lang: en
    - url: /no
      lang: "no"

=email: hans@example.com
=documents@find:
  collection: document
  query:
    email: $email

=html@html:
  @each:
    source: $documents
    as: doc
    index: i
  @then:
    @ul:
      @li:
        =text@upcase: "$i: this is $item"
        =text@truncate: 2
        text: $text
  @else:
    @p: $t.documents.not_found
  @a:
    href: $router.home
    text: $t.home.go_back

@return: $html
```

JSON ACTION

```yml
@allow:
  - email

@validate:
  email:
    required: true
    is: string

=email: $params.email

=admins: [vidar@tekki.no]

@if:
  $email:
    in: $admins
@then:
  =role: admin
@else:
  =role: user

@status: 200
@header: { content-type: text/application }

=users@find:
  collection: user
  query:
    email: $email

@return: $users
```

COMMAND LINE SCRIPT

```yml
=data@read: https://example.com/hello.json

@if:
  $err: { isnt: null }
@then:
  @return: fetch data failed

=user@insert:
  collection: data
  values: $data

@if:
  $err: { isnt: null }
@then:
  @return: fetch data failed

@log: Data inserted

@mail:
  username: $config.mail_username
  password: $config.mail_password
  subject: Hello
  message: |
    Hello $data.email!
    Are you ready for this?
    --
    Tekki AS
```

DATA MANIPULATION

```yml
=data@get:
  collection: company

=company:
  name: Tekki Systems
  founded: 2021
  employees: 42
  location:
    city: Oslo
    country: Norway
  services:
    - Software Development
    - Cloud Hosting
    - Consulting
  contact:
    email: info@tekkisystems.com
    phone: +47 123 45 678

=company.name: $data.name
=company.employees: 5
=company.location: { city: Bergen, country: Sweden }

=company.started: 2021
@delete: $company.founded

=company.services[1]: Hosting
```
