exports['commit-info no environment variables has certain api 1'] = [
  "commitInfo",
  "getBranch",
  "getMessage",
  "getEmail",
  "getAuthor",
  "getSha",
  "getRemoteOrigin",
  "getSubject",
  "getTimestamp",
  "getBody"
]

exports['commit-info no environment variables returns information 1'] = {
  "branch": "test-branch",
  "message": "important commit",
  "email": "me@foo.com",
  "author": "John Doe",
  "sha": "abc123",
  "remote": "git@github.com/repo",
  "timestamp": "123"
}

exports['commit-info no environment variables returns nulls for missing fields 1'] = {
  "branch": "test-branch",
  "message": null,
  "email": "me@foo.com",
  "author": null,
  "sha": "abc123",
  "remote": null,
  "timestamp": "123"
}

exports['commit-info combination with environment variables has certain api 1'] = [
  "commitInfo",
  "getBranch",
  "getMessage",
  "getEmail",
  "getAuthor",
  "getSha",
  "getRemoteOrigin",
  "getSubject",
  "getTimestamp",
  "getBody"
]

exports['commit-info combination with environment variables returns information 1'] = {
  "branch": "test-branch",
  "message": "some git message",
  "email": "user@company.com",
  "author": "John Doe",
  "sha": "abc123",
  "remote": "git@github.com/repo",
  "timestamp": "123"
}
