# Immutable, does not change other variable on change
# Expand means applying vars (immutable) and pipes
# Set and get must always expand before read and write
# Pipes disappear, only piped value is set and get
# Setter is only used when extension returns value
# Create if it doesn't exist, overwrite if exists
# Expand expands inside objects as well
# Full dot notation

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
