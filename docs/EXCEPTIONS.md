Each function returns a tuple of result and error:

```yml
=result,err@func: {}
```

Throwing an exception in a function will set $err and result to null, returning a non-undefined value will set result, and $err to null.

This is an extension handler:

```js
async function func(input) {
  // Return error
  return [null, 'something happened']

  // same as return [null, 'something happened']
  throw Error('something happened')

  return ['good result', null]
}
```

If you want to handle the error:

```yml
=result,err@func: {}
@if:
  $err:
    isnt: null
@then:
  @return: $err
```

A short cut for this pattern involves adding an exclamation mark after the function call:

```yml
@func!: {}
```

It will catch and return the error automatically.

If you don't care about the result, or the result is always undefined, you can suppress the result like this:

```yml
=,err@func: {}
```
