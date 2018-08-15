const { getGitBranch } = require('./git-api')
const debug = require('debug')('commit-info')

function firstFoundValue (keys, object = process.env) {
  const found = keys.find(key => {
    return key in object
  })
  return found ? object[found] : null
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

module.exports = {
  firstFoundValue,
  getBranch
}
