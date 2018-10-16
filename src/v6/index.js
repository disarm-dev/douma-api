const User_v5 = require('./lib/auth')
const addPermission = User_v5.addPermission

const login = require('./routes/login')
const plan = require('./routes/plan')
const record = require('./routes/record')
const assignment_plan = require('./routes/assignment_plan')
const cluster = require('./routes/foci/case_clusters')
const case_location = require('./routes/foci/case_locations')
const maas = require('./maas')

User_v5.updateUserList()
// TODO: Remove side effect
let _version = '';

const version_meta = (req, res) => res.send({
    DOUMA_API: process.env.SOURCE_VERSION || 'DEV',
    version: _version
})

const POST = 'post'
const GET = 'get'
const PUT = 'put'
const DELETE = 'delete'

const endpoints = [
    {
        permissions: ['*'],
        method: GET,
        path: '/',
        callback: version_meta
    },
    {
        permissions: ['*'],
        method: GET,
        path: '/refresh_users',
        callback: User_v5.forceUpdateUserList
    },
    {
        permissions: ['*'],
        method: POST,
        path: '/login',
        callback: login.login
    },
    {
        permissions: ['read:irs_plan', 'read:irs_monitor', 'read:irs_tasker'],
        method: GET,
        path: '/plan/current',
        callback: plan.get_current
    },
    {
        permissions: ['read:irs_plan', 'read:irs_monitor', 'read:irs_tasker'],
        method: GET,
        path: '/plan/all',
        callback: plan.list_all
    },
    {
        permissions: ['write:irs_plan'],
        method: POST,
        path: '/plan/create',
        callback: plan.create
    },
    {
        permissions: ['read:irs_record_point', 'read:irs_monitor'],
        method: GET,
        path: '/record/all',
        callback: record.get_all
    },
    {
        permissions: ['read:irs_record_point', 'read:irs_monitor'],
        method: POST,
        path: '/record/updates',
        callback: record.get_updates
    },
    {
        permissions: ['write:irs_record_point'],
        method: POST,
        path: '/record/create',
        callback: record.create
    },
    {
        permissions: ['read:irs_tasker'],
        method: GET,
        path: '/assignment_plan/current',
        callback: assignment_plan.read
    },
    {
        permissions: ['write:irs_tasker'],
        method: POST,
        path: '/assignment_plan/create',
        callback: assignment_plan.create
    },
    {
        permissions: ['read:foci'],
        method: GET,
        path: '/foci/case_clusters',
        callback: cluster.get_all
    },
    {
        permissions: ['write:foci'],
        method: POST,
        path: '/foci/case_clusters',
        callback: cluster.create
    },
    {
        permissions: ['write:foci'],
        method: PUT,
        path: '/foci/case_clusters',
        callback: cluster.update
    },
    {
        permissions: ['write:foci'],
        method: DELETE,
        path: '/foci/case_clusters',
        callback: cluster.delete_cluster
    },
    {
        permissions: ['read:foci'],
        method: GET,
        path: '/foci/number_of_case_clusters',
        callback: cluster.count
    },
    {
        permissions: ['read:foci'],
        method: GET,
        path: '/foci/case_locations',
        callback: case_location.get_all,
    },
    {
        permissions: ['write:foci'],
        method: POST,
        path: '/foci/case_locations',
        callback: case_location.create
    },
    {
        permissions: ['write:foci'],
        method: POST,
        path: '/foci/case_locations/bulk',
        callback: case_location.create_bulk
    },
    {
        permissions: ['write:foci'],
        method: PUT,
        path: '/foci/case_locations',
        callback: case_location.update
    },
    {
        permissions: ['write:foci'],
        method: DELETE,
        path: '/foci/case_locations',
        callback: case_location.delete_case_location
    },
    {
        permissions: ['read:foci'],
        method: GET,
        path: '/foci/number_of_case_locations',
        callback: case_location.count
    },
    {
        permissions: ['write:foci'],
        method: POST,
        path: '/foci/model/run',
        callback: maas.generate_foci
    }
]

module.exports = function (app, version) {
    const version_prefix = '/' + version
    _version = version

    function v(url) {
        return version_prefix + url
    }

    const make_endpoint = (endpoint) => {
        addPermission(endpoint.method, endpoint.path, endpoint.permissions)
        app[endpoint.method](v(endpoint.path), endpoint.callback)
    }

    const version_path_regex = new RegExp(version_prefix)
    app.use(version_path_regex, User_v5.authMiddleware)
    app.use(version_path_regex, User_v5.endpointPermissionsMiddleware)
    app.use(version_path_regex, User_v5.optionsMiddleware)

    endpoints.forEach(make_endpoint)


}
