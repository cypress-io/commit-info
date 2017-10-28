'use strict'

const la = require('lazy-ass')
const R = require('ramda')
const { stubSpawnShellOnce } = require('stub-spawn-once')
const Promise = require('bluebird')
const snapshot = require('snap-shot-it')

/* eslint-env mocha */
describe('git-api', () => {
  const { gitCommands } = require('./git-api')

  describe('getting commit info', () => {
    const {
      getMessage,
      getEmail,
      getAuthor,
      getSha,
      getRemoteOrigin
    } = require('./git-api')

    it('works', () => {
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

      return Promise.props({
        message: getMessage(),
        email: getEmail(),
        author: getAuthor(),
        sha: getSha(),
        remote: getRemoteOrigin()
      }).then(snapshot)
    })
  })

  describe('getBranch', () => {
    const { getBranch } = require('./utils')

    context('CI environment', () => {
      const initialEnv = R.clone(process.env)

      beforeEach(() => {
        process.env.TRAVIS_BRANCH = 'travis-branch'
        process.env.CI_BRANCH = 'ci-branch'
      })

      afterEach(() => {
        process.env = R.clone(initialEnv)
      })

      it('finds travis branch', () =>
        getBranch().then(branch =>
          la(branch === 'travis-branch', 'wrong branch', branch)
        ))
    })

    context('local environment', () => {
      const initialEnv = R.clone(process.env)

      beforeEach(() => {
        // remove all possible CI branch variables
        delete process.env.CIRCLE_BRANCH
        delete process.env.TRAVIS_BRANCH
        delete process.env.BUILDKITE_BRANCH
        delete process.env.CI_BRANCH
      })

      afterEach(() => {
        process.env = R.clone(initialEnv)
      })

      it('uses git to determine branch', () => {
        stubSpawnShellOnce(gitCommands.branch, 0, 'mock-test-branch', '')
        return getBranch().then(branch =>
          la(branch === 'mock-test-branch', 'wrong branch from git', branch)
        )
      })

      it('returns empty string on failure', () => {
        stubSpawnShellOnce(gitCommands.branch, 1, '', 'nope')
        return getBranch().then(branch =>
          la(branch === '', 'wrong empty branch from git', branch)
        )
      })

      it('returns empty string on HEAD', () => {
        stubSpawnShellOnce(gitCommands.branch, 0, 'HEAD', '')
        return getBranch().then(branch =>
          la(branch === '', 'wrong HEAD branch from git', branch)
        )
      })
    })
  })
})
