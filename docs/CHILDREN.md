We can execute the children automatically, or we can require the extension to execute the child, or it can be an option.

```yml
@if: true
@then:
  @return: 1
@else:
  @return: 2
```

So here we want to execute the @then branch.

Here we don't want the @else to even be executed. It relies on state set in the @if.

Solution: We set a state.test, in @then and @else we check this and delete the flag.

It must be up to the author if the children should be executed or not, so we pass run to the the extension and we can execute from there.
