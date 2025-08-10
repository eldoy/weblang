Arrays in weblang means "async", so if the line starts with "-", then it will be processed asynchronously. It doesn't have any effect on its own, but only if there are multiple lines after each other:

- @func: {}
- @func: {}

In the background these two happen in parallel via await Promise.all.

The next line waits for them to finish.

- @func: {} alone is the same as @func: {}