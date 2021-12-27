# Create if it doesn't exist

# Set string
$hello: somestring

# Update string
$hello: somestring

# Set object
$obj:
  key: value

# Set object from var
$obj: $hello # Lookup variable

# Set object from var deep
$hello: $hello.deep.stuff

# Update entire object
$obj:
  key: value

# Partially update object
$obj.key: value

# Delete key

$obj:
  key: null

# Set array
$obj:
  - one
  - two
  - three

# Remove index
$obj[0]: null

# Merge, each var has to be an object
merge$obj:
- $hello
- $bye

# Keep
keep$obj:
- hello
- nisse

# Remove
remove$obj:
- hello
- nisse

# Functions (filters, traps)
$hello: what | encrypt
$hello: actions.validations.cannot_do_something | t

# Errors
error: validation.cannot.be.something | t

# DB
db$result: user/create
