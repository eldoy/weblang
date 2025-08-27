SYNTAX RULES

# Variable assignment
=val: value
=val.prop: value
=val[index]: value
=val: $otherval
=val.prop: $otherval
=val[index]: $otherval
=val: $otherval.prop
=val: $otherval[index]
=val: null
=val: \$literal
=val: hello $otherval and $otherval.prop in string

# Object literals
=val: { key: value }

# Object multiline
=val:
  key: value
  key2: value
  @func: value
  =val: value
  =val@func: value
  =val: $otherval
  =val@func: $otherval
  =val@func: $otherval.prop
  =val@func: $otherval[index]

# Array literals
=val: [value, value]

# Array multiline
=val:
  - value
  - value

# Functions
@func: value
@func: $otherval
@func: $otherval.prop
@func: $otherval[index]

# Assignment via function
=val@func: value
=val@func: $otherval
=val@func: $otherval.prop
=val@func: $otherval[index]
