const expressMongoDb = require('express-mongo-db')

const User = require('./lib/user')
const addPermission = User.addPermission

const {force_refresh_geodata_cache} = require('./routes/meta')
const login                         = require('./routes/login')
const plan                          = require('./routes/plan')
const record                        = require('./routes/record')
const assignment_plan               = require('./routes/assignment_plan')

User.updateUserList()

module.exports = function (app, version) {
    const version_prefix = '/' + version

    function v(url) {
        return version_prefix + url
    }

    app.use(expressMongoDb(process.env.MONGODB_URI))
    app.use(User.authMiddleware)
    app.use(User.endpointPermissionsMiddleware)
    app.use(User.optionsMiddleware)

    // Meta
    // No permissions required - these are openPaths
    app.get(v('/'), (req, res) => res.send({
        DOUMA_API: process.env.SOURCE_VERSION || 'DEV',
        version: version
    }))

    // Auth
    addPermission('post', v('/login'), ['*'])
    app.post(v('/login'), login.login)

    // Plan
    addPermission('get', v('/plan/current'), ['read:irs_plan', 'read:irs_monitor', 'read:irs_tasker'])
    app.get(v('/plan/current'), plan.get_current)

    addPermission('post', v('/plan/current'), ['write:irs_plan'])
    app.post(v('/plan/create'), plan.create)

    // Record
    addPermission('get', v('/record/all'), ['read:irs_record_point', 'read:irs_monitor'])
    app.get(v('/record/all'), record.get_all)
    addPermission('post', v('/record/create'), ['write:irs_record_point'])
    app.post(v('/record/create'), record.create)

    // AssignmentPlan
    addPermission('get', v('/assignment_plan/current'), ['read:irs_tasker'])
    app.get(v('/assignment_plan/current'), assignment_plan.read)
    addPermission('post', v('/assignment_plan/create'), ['write:irs_tasker'])
    app.post(v('/assignment_plan/create'), assignment_plan.create)

}
