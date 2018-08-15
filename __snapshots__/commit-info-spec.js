exports['commit-info returns information 1'] = {
  "branch": "test-branch",
  "message": "important commit",
  "email": "me@foo.com",
  "author": "John Doe",
  "sha": "abc123",
  "remote": "git@github.com/repo"
}

exports['commit-info has certain api 1'] = [
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

exports['commit-info returns empty strings for missing info 1'] = {
  "branch": "test-branch",
  "message": null,
  "email": "me@foo.com",
  "author": null,
  "sha": "abc123",
  "remote": null
}
