We support pipes.

name: hello |> upcase

{
  "name": "hello |> upcase 2"
}

{
  key: "name",
  value: "hello",
  pipes: [{ name: 'upcase', args: 2 }]
}

The pipes are applied before the value is sent to the function:

```
=name@func: hello |> upcase
