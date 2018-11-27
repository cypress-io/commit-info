exports['commit-info no environment variables has certain api 1'] = [
  "commitInfo",
  "getBranch",
  "getMessage",
  "getEmail",
  "getAuthor",
  "getSha",
  "getRemoteOrigin",
  "getSubject",
  "getBody"
]

exports['commit-info no environment variables returns empty strings for missing info 1'] = {
  "branch": "test-branch",
  "message": null,
  "email": "me@foo.com",
  "author": null,
  "sha": "abc123",
  "remote": null
}

exports['commit-info no environment variables returns information 1'] = {
  "branch": "test-branch",
  "message": "important commit",
  "email": "me@foo.com",
  "author": "John Doe",
  "sha": "abc123",
  "remote": "git@github.com/repo"
}
