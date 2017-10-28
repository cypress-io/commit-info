'use strict'

const debug = require('debug')('commit-info')
const {
  getBranch,
  getMessage,
  getEmail,
  getAuthor,
  getSha,
  getRemoteOrigin
} = require('./utils')

const Promise = require('bluebird')

function commitInfo (folder) {
  folder = folder || process.cwd()
  debug('commit-info in folder', folder)

  return Promise.props({
    branch: getBranch(folder),
    message: getMessage(folder),
    email: getEmail(folder),
    author: getAuthor(folder),
    sha: getSha(folder),
    remote: getRemoteOrigin(folder)
  })
}

module.exports = { commitInfo }
