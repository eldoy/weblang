```yaml
@validate:
  $params.email:
    required: true
    is: email
  $params.name:
    required: true
    min: 2

@insertUser:
  values:
    email: $params.email
    name: $params.name

=saved: $result

@if:
  $saved.id.is: string

@then:
  @return:
    id: $saved.id

@else:
  @log: Insert failed: $err.message
  @return:
    error: Could not save user
```

```yaml
_validate:
  $params.email:
    required: true
    is: email
  $params.name:
    required: true
    min: 2

_insertUser:
  values:
    email: $params.email
    name: $params.name

=saved: $result

_if:
  $saved.id.is: string

_then:
  _return:
    id: $saved.id

_else:
  _log: Insert failed: $err.message
  _return:
    error: Could not save user
```

```yaml
Validate:
  $params.email:
    required: true
    is: email
  $params.name:
    required: true
    min: 2

InsertUser:
  values:
    email: $params.email
    name: $params.name

=saved: $result

If:
  $saved.id.is: string

Then:
  Return:
    id: $saved.id

Else:
  Log: Insert failed: $err.message
  Return:
    error: Could not save user
```