'use strict'

/* eslint-env mocha */
const { commitInfo } = require('.')
const { stubSpawnShellOnce } = require('stub-spawn-once')
const snapshot = require('snap-shot-it')
const { gitCommands } = require('./utils')

describe('commit-info', () => {
  const env = process.env

  beforeEach(() => {
    process.env = {}
  })

  afterEach(() => {
    process.env = env
  })

  it('returns information', () => {
    stubSpawnShellOnce(gitCommands.branch, 0, 'test-branch', '')
    stubSpawnShellOnce(gitCommands.message, 0, 'important commit', '')
    stubSpawnShellOnce(gitCommands.email, 0, 'me@foo.com', '')
    stubSpawnShellOnce(gitCommands.author, 0, 'John Doe', '')
    stubSpawnShellOnce(gitCommands.sha, 0, 'abc123', '')
    stubSpawnShellOnce(
      gitCommands.remoteOriginUrl,
      0,
      'git@github.com/repo',
      ''
    )
    return commitInfo().then(snapshot)
  })

  it('returns empty strings for missing info', () => {
    stubSpawnShellOnce(gitCommands.branch, 0, 'test-branch', '')
    stubSpawnShellOnce(gitCommands.message, 1, '', 'no message')
    stubSpawnShellOnce(gitCommands.email, 0, 'me@foo.com', '')
    stubSpawnShellOnce(gitCommands.author, 1, '', 'missing author')
    stubSpawnShellOnce(gitCommands.sha, 0, 'abc123', '')
    stubSpawnShellOnce(gitCommands.remoteOriginUrl, 1, '', 'no remote origin')
    return commitInfo().then(snapshot)
  })
})
