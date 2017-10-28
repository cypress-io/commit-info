const chdir = require('chdir-promise')
const execa = require('execa')
const debug = require('debug')('commit-info')
const la = require('lazy-ass')
const is = require('check-more-types')
const Promise = require('bluebird')

// common git commands for getting basic info
const gitCommands = {
  branch: 'git rev-parse --abbrev-ref HEAD',
  message: 'git show -s --pretty=%B',
  email: 'git show -s --pretty=%ae',
  author: 'git show -s --pretty=%an',
  sha: 'git show -s --pretty=%H',
  remoteOriginUrl: 'git config --get remote.origin.url'
}

const prop = name => object => object[name]
const emptyString = () => ''

const runGitCommand = (pathToRepo, gitCommand) => {
  pathToRepo = pathToRepo || process.cwd()
  la(is.unemptyString(pathToRepo), 'missing repo path', pathToRepo)
  la(is.unemptyString(gitCommand), 'missing git command', gitCommand)
  la(gitCommand.startsWith('git'), 'invalid git command', gitCommand)

  const runGit = () => execa.shell(gitCommand).then(prop('stdout'))

  debug('running git command: %s', gitCommand)
  return chdir
    .to(pathToRepo)
    .then(runGit)
    .tap(chdir.back)
    .catch(emptyString)
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
  return runGitCommand(pathToRepo, gitCommands.branch)
    .then(checkIfDetached)
    .catch(emptyString)
}

function firstFoundValue (keys, object = process.env) {
  const found = keys.find(key => {
    return key in object
  })
  return found ? object[found] : null
}

// first try finding branch from CI environment variables
// if fails, use "git" command
function getBranch (pathToRepo) {
  pathToRepo = pathToRepo || process.cwd()
  const ciNames = [
    'CIRCLE_BRANCH',
    'TRAVIS_BRANCH',
    'BUILDKITE_BRANCH',
    'CI_BRANCH'
  ]
  const ciBranch = firstFoundValue(ciNames, process.env)
  if (ciBranch) {
    return Promise.resolve(ciBranch)
  }
  return getGitBranch(pathToRepo)
}

const getMessage = pathToRepo => runGitCommand(pathToRepo, gitCommands.message)

const getEmail = pathToRepo => runGitCommand(pathToRepo, gitCommands.email)

const getAuthor = pathToRepo => runGitCommand(pathToRepo, gitCommands.author)

const getSha = pathToRepo => runGitCommand(pathToRepo, gitCommands.sha)

const getRemoteOrigin = pathToRepo =>
  runGitCommand(pathToRepo, gitCommands.remoteOriginUrl)

module.exports = {
  runGitCommand,
  firstFoundValue,
  getBranch,
  getMessage,
  getEmail,
  getAuthor,
  getSha,
  getRemoteOrigin,
  gitCommands
}
