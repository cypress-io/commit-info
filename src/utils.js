const Promise = require('bluebird')
const { getGitBranch } = require('./git-api')
const debug = require('debug')('commit-info')

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
    debug('found branch %s from CI variable', ciBranch)
    return Promise.resolve(ciBranch)
  }
  debug('could not find branch from CI variables')
  debug('using Git tool to find branch')
  return getGitBranch(pathToRepo)
}

module.exports = {
  firstFoundValue,
  getBranch
}
