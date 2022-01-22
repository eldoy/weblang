# Weblang

The Weblang low code programming language lets you write safe, portable and efficient code with minimal logic. Created to let users run code on your server, but can be extended to run anything anywhere.

The code is written using YAML, which can easily be transformed to and from JSON.

### Install
```
npm i weblang
```

### Usage

```js
const weblang = require('weblang')
const code = '$hello: world'
const state = await weblang()(code)
```

### Set

Set variables, available in `state.vars`:

```yaml
# Set string variable
$hello: world

# Set object variable
$hello:
  a: 1
  b: 2

# Set array variable
$hello:
  - 1
  - 2

# Set bool variable
$hello: true

# Set variable from other variable
$hello: world
$bye: $hello

# Set object value from other variable
$hello: world
$bye:
  name: $hello

# Set array index from other variable
$hello: world
$bye:
  - $hello

# Set variable, nested, dot notation
$hello.name: world

# Delete variable
$hello: null

# Delete value from object
$hello:
  name: null

# Delete value from object, dot notation
$hello.name: null

# Delete array index, dot notation
$hello[0]: null

# Set variable from object, dot notation
$hello:
  name:
    deep: 1
$bye: $hello.name.deep

# Set variable from array, dot notation
$hello:
  - 1
  - 2
$bye: $hello[0]

# Set variable from object array, dot notation
$hello:
  - name: nils
$bye: $hello[0].name

# Non existing variables are empty strings
$bye: $hello
```

### If then else

Minimal logic is achieved through _if, then and else_.

The validations inside the if-section are from [the d8a validations.](https://github.com/eldoy/d8a)

```yaml
required: true # this means can not be undefined
eq: 5          # Equal to
ne: 5          # Not equal to
gt: 5          # Greater than
lt: 5          # Less than
gte: 5         # Greater than or equal to
lte: 5         # Less than or equal to
in:            # Must be in list
  - 1
  - 2
  - 3
nin:           # Must not be in list
  - 1
  - 2
  - 3
length: 5      # Length of string must be
min: 5         # Minimum length of string
max: 5         # Maximum length of string
match: /regex/ # Must match regex
is: boolean    # Must be true or false
is: string     # Must be a string
is: number     # Must be a number, integer or decimal (float)
is: integer    # Must be an integer
is: decimal    # Must be a decimal number
is: date       # Must be a date
is: id         # Must be an id
is: object     # Must be an object
is: array      # Must an array
is: email      # Must be an email address
is: url        # Must be a URL
```

This is how you use them:
```yaml
# If with then
if:
  $hello:
    name:
      eq: nils
then:
  $hello.name: hans

# Multiple checks
if:
  $hello:
    name:
      eq: nils
  $req:
    pathname:
      eq: /hello
then:
  $hello.name: hans

# Checks works with dot notation as well
if:
  $hello.name.eq: nils
then:
  $hello.name: hans

# if else
if:
  $hello:
    name:
      eq: hans
then:
  $hello.name: guri
else:
  $hello.name: kari
```

### Return

The _return_ command sets a variable in `state.return`. Using _return_ causes execution to be halted.

```yaml
# Return a string
return: hello

# Return a string variable
$hello: world
return: $hello

# Return an object variable
$hello:
  name: world
return: $hello

# Return an array variable
$hello:
  - 1
  - 2
return: $hello

# Return a variable, dot notation
$hello:
  name:
    baner: 1
return: $hello.name
```

### Vars

You can prefill the state with your own variables:

```js
const req = { pathname: '/hello' }
const run = await weblang({
  vars: { req }
})
```

Use some _code_ like this:
```yaml
# Modify pathname
$req.pathname: /bye

# Return the modified pathname
return: $req.pathname
```

Then run with:
```js
await run(code)

// Pass params to extensions
const params = { name: 'hello' }
await run(code, params)
```

### Pipes

Variables can be run through _pipes_, which are functions that transform a value.

If the pipe does not exist, it is ignored.

Currently 3 built in pipes exist:
* __upcase__ - transform a string value to upper case
* __downcase__ - transform a string value to lower case
* __capitalize__ - capitalize the first letter of a string

```yaml
# Use pipes with string
$hello: hello | upcase

# Use pipes with variables
$hello: hello
$bye: $hello | upcase

# Use pipes with return
return: hello | capitalize

# Multiple pipes
return: hello | upcase | downcase | capitalize
```

You can add your own pipes or replace the existing ones using the _pipes_ option:
```js
// Add a pipe named 'hello'
const run = await weblang({
  pipes: {
    hello: function(str) {
      if (typeof str != 'string') return str
      return 'hello ' + str
    }
  }
})
```
and the use it like this:

```yaml
return: world | hello
```

### Extensions

Weblang can (and should) be extended with your own commands. Define an extension function like this:

```js
// Function called db
const db = function({
  state,  // the runner's state with vars and return
  key,    // the name of the function, here 'db'
  raw,    // the object you send to this function
  val,    // the object, variables and pipes applied
  setter, // store the result in this variable
  id,     // the duplicate key id, if any
  run,    // the run function that runs your code
  set,    // use this to set variables, prefix with '$'
  get,    // use this to get variables and run pipes
  params  // parameters passed to your extensions
}) {

  // Example use of set
  set('$internal', 'hello')

  // Whatever you return will be in your setter
  return { id: '1' }
}
```

Add the function to the runner like this:

```js
const run = await weblang({
  ext: { db }
})
```

Define the _code_ like this:
```yaml
db: user/create
```

and run with the extension like this:
```js
const state = await run(code)
```

To set the result of the function, use the _extension variable setter syntax_:

```yaml
db$result: user/create
```

and the `result` variable will be available in `state.vars.result`.

### Duplicate keys

Since YAML doesn't support duplicate keys you can write code using the `duplicate key syntax`:

```yaml
if@1:
  $req.pathname.eq: /users
then@1:
  $hello: 1

if@2:
  $req.pathname.eq: /users
then@2:
  $hello: 2
```

The `@id` can be anything you want, it's just to avoid duplicate key errors.

### License

MIT Licensed. Enjoy!
