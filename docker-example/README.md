# Docker example

Shows how to pass environment variables with Git commit information when starting a Docker container.

To see the example:

```text
$ ./build.sh
...

Successfully built 54bcfe1f016e
Successfully tagged local/test:latest
docker-example index.js
{
  branch: 'develop',
  message: 'This is commit message',
  email: null,
  author: null,
  sha: 'e5d9eb66474bc0b681da9240aa5a457fe17bc8f3',
  remote: null
}
```

See [build.sh](build.sh) to see how we are passing the commit values as environment variables.

If you want to see debug messages, run the command with `DEBUG=commit-info` environment variable.

```text
$ DEBUG=commit-info ./build.sh
```
