'use strict'

/* eslint-env mocha */
const { commitInfo } = require('.')
const { stubSpawnShellOnce } = require('stub-spawn-once')
const snapshot = require('snap-shot-it')
const { gitCommands } = require('./git-api')
const la = require('lazy-ass')
const is = require('check-more-types')
const mockedEnv = require('mocked-env')

describe('getBranch', () => {
  const { getBranch } = require('.')

  it('is a function', () => {
    la(is.fn(getBranch))
  })

  it('returns null for empty output', () => {
    stubSpawnShellOnce(gitCommands.branch, 0, '', '')
    return getBranch().then(branch => {
      la(
        branch === null,
        'empty branch should be null, but it was',
        typeof branch
      )
    })
  })

  it('returns null on git error', () => {
    stubSpawnShellOnce(gitCommands.branch, 1, '', 'something wrong')
    return getBranch().then(branch => {
      la(
        branch === null,
        'empty branch should be null, but it was',
        typeof branch
      )
    })
  })

  it('returns null on git HEAD', () => {
    stubSpawnShellOnce(gitCommands.branch, 0, 'HEAD', '')
    return getBranch().then(branch => {
      la(
        branch === null,
        'empty branch should be null, but it was',
        typeof branch
      )
    })
  })
})

describe('commit-info', () => {
  describe('no environment variables', () => {
    let restoreEnvironment

    beforeEach(() => {
      restoreEnvironment = mockedEnv({}, { clear: true })
    })

    afterEach(() => {
      restoreEnvironment()
    })

    it('has certain api', () => {
      const api = require('.')
      snapshot(Object.keys(api))
    })

    it('returns information', () => {
      stubSpawnShellOnce(gitCommands.branch, 0, 'test-branch', '')
      stubSpawnShellOnce(gitCommands.message, 0, 'important commit', '')
      stubSpawnShellOnce(gitCommands.email, 0, 'me@foo.com', '')
      stubSpawnShellOnce(gitCommands.author, 0, 'John Doe', '')
      stubSpawnShellOnce(gitCommands.sha, 0, 'abc123', '')
      stubSpawnShellOnce(gitCommands.timestamp, 0, '123', '')
      stubSpawnShellOnce(
        gitCommands.remoteOriginUrl,
        0,
        'git@github.com/repo',
        ''
      )
      return commitInfo().then(snapshot)
    })

    it('returns nulls for missing fields', () => {
      stubSpawnShellOnce(gitCommands.branch, 0, 'test-branch', '')
      stubSpawnShellOnce(gitCommands.message, 1, '', 'no message')
      stubSpawnShellOnce(gitCommands.email, 0, 'me@foo.com', '')
      stubSpawnShellOnce(gitCommands.author, 1, '', 'missing author')
      stubSpawnShellOnce(gitCommands.sha, 0, 'abc123', '')
      stubSpawnShellOnce(gitCommands.remoteOriginUrl, 1, '', 'no remote origin')
      stubSpawnShellOnce(gitCommands.timestamp, 0, '123', '')
      return commitInfo()
        .tap(info => {
          la(info.message === null, 'message should be null', info)
          la(info.author === null, 'author should be null', info)
          la(info.remote === null, 'remoteOriginUrl should be null', info)
        })
        .then(snapshot)
    })

    it('has getRemoteOrigin method', () => {
      const { getRemoteOrigin } = require('.')
      la(is.fn(getRemoteOrigin))
    })
  })

  describe('combination with environment variables', () => {
    let restoreEnvironment

    beforeEach(() => {
      restoreEnvironment = mockedEnv(
        {
          COMMIT_INFO_MESSAGE: 'some git message',
          COMMIT_INFO_EMAIL: 'user@company.com'
        },
        { clear: true }
      )
    })

    afterEach(() => {
      restoreEnvironment()
    })

    it('has certain api', () => {
      const api = require('.')
      snapshot(Object.keys(api))
    })

    it('returns information', () => {
      stubSpawnShellOnce(gitCommands.branch, 0, 'test-branch', '')
      stubSpawnShellOnce(
        gitCommands.message,
        1,
        '',
        'could not get Git message'
      )
      stubSpawnShellOnce(gitCommands.email, 1, '', 'could not get Git email')
      stubSpawnShellOnce(gitCommands.author, 0, 'John Doe', '')
      stubSpawnShellOnce(gitCommands.sha, 0, 'abc123', '')
      stubSpawnShellOnce(gitCommands.timestamp, 0, '123', '')
      stubSpawnShellOnce(
        gitCommands.remoteOriginUrl,
        0,
        'git@github.com/repo',
        ''
      )
      return commitInfo().then(snapshot)
    })
  })
})
