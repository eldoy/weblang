Want to map each function to a test.

1. Find all functions that we need
2. Start testing them
3. Rewrite existing functions

What are the pieces?

1. compile
2. run
3. state
  a. $result
  b. $err

Different pieces of syntax:

0. block (space delimited)
1. = set variable
  a. destructuring: =a,b,c: [1, 2, 3]
2. $ get variable
3. @ run function
  a. ! run and throw
  b. ? run and set
  c. destructuring: =a,b,c@func: {}
4. - parallel io
5. =@ task (inline function)
6. & background? (async)
7. * interval? (cron)

Extensions:

1. if-else-then
2. return
3. map / each
4. html
