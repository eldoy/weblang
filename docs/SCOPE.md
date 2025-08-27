### Scope model

Scope is global > parents > local for set and get.

For each function call, we add a scope to the stack. Variables in the local scope only survive as long as the function is running.

To set global variables, or parent variables, from local scope, the variable needs to exist already.

```yml
# This will always be global, define global vars here.
=val:

@if:
  $hello:
    is: string
@then:
  =val: value
```

In this example, the variable `val` will be local as it doesn't exist globally.

```yml
@if:
  $hello:
    is: string
@then:
  =val: value

@log: $val
```
