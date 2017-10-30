const execa = require('execa')
const debug = require('debug')('commit-info')
const la = require('lazy-ass')
const is = require('check-more-types')
const Promise = require('bluebird')

// common git commands for getting basic info
// https://git-scm.com/docs/git-show
const gitCommands = {
  branch: 'git rev-parse --abbrev-ref HEAD',
  message: 'git show -s --pretty=%B',
  subject: 'git show -s --pretty=%s',
  body: 'git show -s --pretty=%b',
  email: 'git show -s --pretty=%ae',
  author: 'git show -s --pretty=%an',
  sha: 'git show -s --pretty=%H',
  remoteOriginUrl: 'git config --get remote.origin.url'
}

const prop = name => object => object[name]
const emptyString = () => ''

const debugError = (gitCommand, folder, e) => {
  debug('got an error running command "%s" in folder "%s"', gitCommand, folder)
  debug(e)
}

const runGitCommand = (gitCommand, pathToRepo) => {
  la(is.unemptyString(gitCommand), 'missing git command', gitCommand)
  la(gitCommand.startsWith('git'), 'invalid git command', gitCommand)

  pathToRepo = pathToRepo || process.cwd()
  la(is.unemptyString(pathToRepo), 'missing repo path', pathToRepo)

  debug('running git command: %s', gitCommand)
  debug('in folder %s', pathToRepo)

  return Promise.resolve()
    .then(() => execa.shell(gitCommand, { cwd: pathToRepo }))
    .then(prop('stdout'))
    .tap(stdout => debug('git stdout:', stdout))
    .catch(e => {
      debugError(gitCommand, pathToRepo, e)
      return emptyString()
    })
}

/*
  "gift" module returns "" for detached checkouts
  and our current command returns "HEAD"
  so we must imitate gift's behavior

  example:
  git checkout <commit sha>
  get git branch returns "HEAD"
*/
const checkIfDetached = branch => (branch === 'HEAD' ? '' : branch)

function getGitBranch (pathToRepo) {
  return runGitCommand(gitCommands.branch, pathToRepo)
    .then(checkIfDetached)
    .catch(emptyString)
}

const getMessage = runGitCommand.bind(null, gitCommands.message)

const getSubject = runGitCommand.bind(null, gitCommands.subject)

const getBody = runGitCommand.bind(null, gitCommands.body)

const getEmail = runGitCommand.bind(null, gitCommands.email)

const getAuthor = runGitCommand.bind(null, gitCommands.author)

const getSha = runGitCommand.bind(null, gitCommands.sha)

const getRemoteOrigin = runGitCommand.bind(null, gitCommands.remoteOriginUrl)

module.exports = {
  runGitCommand,
  getGitBranch,
  getSubject,
  getBody,
  getMessage,
  getEmail,
  getAuthor,
  getSha,
  getRemoteOrigin,
  gitCommands
}
