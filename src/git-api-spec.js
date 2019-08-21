'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const chdir = require('chdir-promise')
const { stubSpawnShellOnce } = require('stub-spawn-once')
const Promise = require('bluebird')
const snapshot = require('snap-shot-it')
const { join } = require('path')

/* eslint-env mocha */
describe('git-api', () => {
  const { gitCommands } = require('./git-api')

  context('getGitBranch', () => {
    const { getGitBranch } = require('./git-api')

    let currentBranch

    before(() => {
      return getGitBranch().then(x => {
        currentBranch = x
        console.log('current git branch is', x)
      })
    })

    it('is a function', () => {
      la(is.fn(getGitBranch))
    })

    // we cannot run this test during pre-commit hook
    // because the branch command fails with an error
    //  fatal: Not a git repository: '.git'
    // thus we usually skip it locally and run on CI
    // on CI the branch is also usually "HEAD" but we want actual
    // branch there. So it really makes sense to run this
    // test locally, but not when committing
    it('finds branch in given repo folder', () => {
      if (currentBranch === null) {
        return
      }
      console.log('current branch "%s"', currentBranch)

      la(
        is.unemptyString(currentBranch),
        'missing branch in current folder',
        currentBranch
      )

      const outsideFolder = join(__dirname, '..', '..')
      // assume repo folder is current working directory!
      const repoFolder = process.cwd()
      return chdir
        .to(outsideFolder)
        .then(() => getGitBranch(repoFolder))
        .finally(chdir.back)
        .then(branch => {
          la(is.unemptyString(branch), 'missing branch with given path', branch)
          la(
            branch === currentBranch,
            'two branch values should be the same',
            branch,
            currentBranch
          )
        })
    })
  })

  describe('subject and body', () => {
    const { getSubject, getBody } = require('./git-api')

    it('gets subject and body', () => {
      stubSpawnShellOnce(gitCommands.subject, 0, 'commit does this', '')
      stubSpawnShellOnce(gitCommands.body, 0, 'more details', '')
      return Promise.props({
        subject: getSubject(),
        body: getBody()
      }).then(snapshot)
    })
  })

  describe('getting commit info', () => {
    const {
      getMessage,
      getEmail,
      getAuthor,
      getSha,
      getRemoteOrigin,
      getTimestamp
    } = require('./git-api')

    it('works', () => {
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

      return Promise.props({
        message: getMessage(),
        email: getEmail(),
        author: getAuthor(),
        sha: getSha(),
        remote: getRemoteOrigin(),
        timestamp: getTimestamp()
      }).then(snapshot)
    })
  })
})
