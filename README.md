# @cypress/commit-info

> Collects Git commit info from CI or from CLI

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]

## Install

Requires [Node](https://nodejs.org/en/) version 6 or above.

```sh
npm install --save @cypress/commit-info
```

## Use

```js
const {commitInfo} = require('@cypress/commit-info')
// default folder is current working directory
commitInfo(folder)
  .then(info => {
    // info object will have properties
    // branch
    // message
    // email
    // author
    // sha
    // remote
  })
```

Notes:

- Resolves with [Bluebird](https://github.com/petkaantonov/bluebird) promise.
- Tries to read branch from CI variables first, otherwise uses Git command.
- If a command fails, returns empty string for each property
- If you need to debug, run with `DEBUG=commit-info` environment variable.

## Individual methods

In addition to `commitInfo` this module also exposes individual promise-returning
methods `getBranch`, `getMessage`, `getEmail`, `getAuthor`, `getSha`, `getRemoteOrigin`.

For example

```js
const {getAuthor} = require('@cypress/commit-info')
getAuthor('path/to/repo')
  .then(name => ...)
```

### getBranch

Resolves with the current git branch name. 

```js
const {getBranch} = require('@cypress/commit-info')
getBranch()
  .then(branch => ...)
```

- First tries to get the branch from CI variables, otherwise runs a `git ...` command
- If this is detached commit (reporting `HEAD`), returns an empty string

### Small print

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/cypress-io/commit-info/issues) on Github

## MIT License

Copyright (c) 2017 Cypress.io

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/commit-info.svg?downloads=true
[npm-url]: https://npmjs.org/package/commit-info
[ci-image]: https://travis-ci.org/cypress-io/commit-info.svg?branch=master
[ci-url]: https://travis-ci.org/cypress-io/commit-info
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
