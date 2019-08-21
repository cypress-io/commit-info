const { getGitBranch } = require('./git-api')
const debug = require('debug')('commit-info')

function firstFoundValue (keys, object = process.env) {
  const found = keys.find(key => {
    return key in object
  })
  return found ? object[found] : null
}

const getValue = name => o => {
  if (name in o) {
    return o[name]
  }
  return null
}

/**
 * Uses "git" command to find the current branch
 *
 * @param {string} pathToRepo
 * @returns {Promise<string|null>} Resolves with Git branch or null
 */
function getBranch (pathToRepo) {
  pathToRepo = pathToRepo || process.cwd()
  debug('using Git tool to find branch')
  return getGitBranch(pathToRepo)
}

/**
 * Looks up commit information from environment keys.
 */
function getCommitInfoFromEnvironment (env = process.env) {
  return {
    branch: getValue('COMMIT_INFO_BRANCH')(env),
    message: getValue('COMMIT_INFO_MESSAGE')(env),
    email: getValue('COMMIT_INFO_EMAIL')(env),
    author: getValue('COMMIT_INFO_AUTHOR')(env),
    sha: getValue('COMMIT_INFO_SHA')(env),
    timestamp: getValue('COMMIT_INFO_TIMESTAMP')(env),
    remote: getValue('COMMIT_INFO_REMOTE')(env)
  }
}

/**
 * Returns list of Git properties that this module searches for
 */
function getFields () {
  return ['branch', 'message', 'email', 'author', 'sha', 'remote', 'timestamp']
}

module.exports = {
  firstFoundValue,
  getBranch,
  getCommitInfoFromEnvironment,
  getFields
}
