console.log('docker-example index.js')

const { commitInfo } = require('./src')
commitInfo().then(console.log)
