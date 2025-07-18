=var: string|number|boolean|null

=var: { a: 1, b: 2 }

=var:
  a: 1
  b: 2

=var: [1, 2]

=var:
  - 1
  - 2

=var[0]: value

=var.key: value

=source: hello
=target: $source

=source: hello
=target:
  key: $source

=source: hello
=target[0]: $source

=target: "$literal"

=var: null

=var.key: null

=var[0]: null

=var: { a: 1 }
=var: { b: 2 }

$var
$var.key
$var[0]
$var[0].key

@if:
  $var:
    eq: 5
@then:
  =x: 1

@if:
  $var:
    eq: 5
  $other:
    in: [1, 2]
@then:
  =x: 1

@if:
  $var:
    eq: 5
@then:
  =x: 1
@else:
  =x: 2

@if:
  $var.key.eq: 5
@then:
  =x: 1

@return: value

@return: $var

@return: $var.key

@return: value | pipe

@return: $var | pipe1 | pipe2

@return: $var | pipe key=val

=var: value | pipe

=var: value | pipe1 | pipe2

=var: value | pipe key=val

@ext: input

=result@ext: input

=@func:
  @add: {}
  @sum: {}

=var1,var2,var3: [1, 2, 3]

=var1,var2,var3\@func: {}

=var1,var2,var3:
  - @func: {}
  - @func: {}

- @func: {}
- @func: {}

@func:
  @hello: {}
  @bye: {}

=hello@func:
  @hello: {}
  @bye: {}

@func&:
  @hello: {}
  @bye: {}

@func?: hello

@func!: hello

@func!?: hello

NOTES[1]:

To simplify the language, and make it more flexible, we can remove the postfix syntaxes but let extension authors use them in the function name.

NOTES[2]:

This should seriously be rewritting in Golang or else it will be hard to scale.
