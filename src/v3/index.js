
const authenticate = require('./authentication')

module.exports = function (app, db, version) {
    const version_prefix = "/" + version

    app.post(version_prefix + '/auth', authenticate)
}