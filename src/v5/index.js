const User_v5 = require('./lib/auth')
const addPermission = User_v5.addPermission

const login = require('./routes/login')
const plan = require('./routes/plan')
const record = require('./routes/record')
const assignment_plan = require('./routes/assignment_plan')

User_v5.updateUserList()

const version_meta = (req, res) => res.send({
    DOUMA_API: process.env.SOURCE_VERSION || 'DEV',
    version: version
})

const endpoints = [
    {
        permissions: ['*'],
        method: 'get',
        path: '/',
        callback: version_meta
    },
    {
        permissions: ['*'],
        method: 'get',
        path: '/refresh_users',
        callback: User_v5.forceUpdateUserList
    },
    {
        permissions: ['*'],
        method: 'post',
        path: '/login',
        callback: login.login
    },
    {
        permissions: ['read:irs_plan', 'read:irs_monitor', 'read:irs_tasker'],
        method:'post'
    }
]

module.exports = function (app, version) {
    const version_prefix = '/' + version

    function v(url) {
        return version_prefix + url
    }

    const version_path_regex = new RegExp(version_prefix)
    app.use(version_path_regex, User_v5.authMiddleware)
    app.use(version_path_regex, User_v5.endpointPermissionsMiddleware)
    app.use(version_path_regex, User_v5.optionsMiddleware)

    // Meta
    addPermission('get', '/', ['*'])
    app.get(v(''), version_meta)

    addPermission('get', '/refresh_users', ['*'])
    app.get(v('/refresh_users'), User_v5.forceUpdateUserList)

    // Auth
    addPermission('post', '/login', ['*'])
    app.post(v('/login'), login.login)

    // Plan
    addPermission('get', '/plan/current', ['read:irs_plan', 'read:irs_monitor', 'read:irs_tasker'])
    app.get(v('/plan/current'), plan.get_current)

    addPermission('post', '/plan/create', ['write:irs_plan'])
    app.post(v('/plan/create'), plan.create)

    // Record
    addPermission('get', '/record/all', ['read:irs_record_point', 'read:irs_monitor'])
    app.get(v('/record/all'), record.get_all)
    addPermission('post', '/record/updates', ['read:irs_record_point', 'read:irs_monitor'])
    app.post(v('/record/updates'), record.get_updates)
    addPermission('post', '/record/create', ['write:irs_record_point'])
    app.post(v('/record/create'), record.create)

    // AssignmentPlan
    addPermission('get', '/assignment_plan/current', ['read:irs_tasker'])
    app.get(v('/assignment_plan/current'), assignment_plan.read)
    addPermission('post', '/assignment_plan/create', ['write:irs_tasker'])
    app.post(v('/assignment_plan/create'), assignment_plan.create)

}
