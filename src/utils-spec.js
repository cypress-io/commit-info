'use strict'

const la = require('lazy-ass')
const R = require('ramda')
const { stubSpawnShellOnce } = require('stub-spawn-once')

/* eslint-env mocha */
describe('utils', () => {
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
        const cmd = 'git rev-parse --abbrev-ref HEAD'
        stubSpawnShellOnce(cmd, 0, 'mock-test-branch', '')
        return getBranch().then(branch =>
          la(branch === 'mock-test-branch', 'wrong branch from git', branch)
        )
      })

      it('returns empty string on failure', () => {
        const cmd = 'git rev-parse --abbrev-ref HEAD'
        stubSpawnShellOnce(cmd, 1, '', 'nope')
        return getBranch().then(branch =>
          la(branch === '', 'wrong empty branch from git', branch)
        )
      })

      it('returns empty string on HEAD', () => {
        const cmd = 'git rev-parse --abbrev-ref HEAD'
        stubSpawnShellOnce(cmd, 0, 'HEAD', '')
        return getBranch().then(branch =>
          la(branch === '', 'wrong HEAD branch from git', branch)
        )
      })
    })
  })

  describe('firstFoundValue', () => {
    const { firstFoundValue } = require('./utils')

    const env = {
      a: 1,
      b: 2,
      c: 3
    }

    it('finds first value', () => {
      const found = firstFoundValue(['a', 'b'], env)
      la(found === 1, found)
    })

    it('finds second value', () => {
      const found = firstFoundValue(['z', 'a', 'b'], env)
      la(found === 1, found)
    })

    it('finds nothing', () => {
      const found = firstFoundValue(['z', 'x'], env)
      la(found === null, found)
    })
  })
})
