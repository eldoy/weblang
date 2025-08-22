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
