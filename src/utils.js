const chdir = require('chdir-promise')
const execa = require('execa')
const debug = require('debug')('commit-info')
const la = require('lazy-ass')
const is = require('check-more-types')

const prop = name => object => object[name]
const emptyString = () => ''

const runGitCommand = (pathToRepo, gitCommand) => {
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

module.exports = { runGitCommand }
