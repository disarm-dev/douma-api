const Auth = require('./lib/auth')
const addPermission = Auth.addPermission

const login = require('./routes/login')
const plan = require('./routes/plan')
const record = require('./routes/record')
const assignment_plan = require('./routes/assignment_plan')
const cluster = require('./routes/foci/case_clusters')
const case_location = require('./routes/foci/case_locations')
const maas = require('./maas')
const config = require('./routes/config')
const geodata = require('./routes/geodata')
const seasons = require('./routes/seasons')

const {url_base} = require('./lib/url_helper')

Auth.updateUserList()
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
        callback: Auth.forceUpdateUserList
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
        path: '/plan/detail/:plan_id',
        callback: plan.plan_by_id
    },
    {
        permissions: ['write:irs_plan', 'write:irs_monitor', 'write:irs_tasker'],
        method: PUT,
        path: '/plan/:_id',
        callback: plan.update
    },
    {
        permissions: ['write:irs_plan', 'write:irs_monitor', 'write:irs_tasker'],
        method: DELETE,
        path: '/plan/:_id',
        callback: plan.remove
    },
    {
        permissions: ['read:irs_plan', 'read:irs_monitor', 'read:irs_tasker'],
        method: GET,
        path: '/plan/list',
        callback: plan.list_all
    },
    {
        permissions: ['write:irs_plan'],
        method: POST,
        path: '/plan/create',
        callback: plan.create
    },
    {
        permissions: ['read:irs_plan', 'read:irs_monitor'],
        method: GET,
        path: '/plan/current',
        callback: plan.get_current
    },
    {
        permissions: ['read:irs_record_point', 'read:irs_monitor'],
        method: GET,
        path: '/record/all',
        callback: record.get_all
    },
    {
        permissions: ['read:irs_record_point'],
        method: GET,
        path: '/record/filtered',
        callback: record.date_filtered
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
    },
    {
        permissions:['write:config'],
        method:POST,
        path:'/config',
        callback:config[POST]
    },
    {
        permissions:['write:seasons'],
        method:PUT,
        path:'/seasons',
        callback:seasons[PUT]
    },
    {
        permissions:['write:config'],
        method:POST,
        path:'/config/:config_id',
        callback:config[POST]
    },
    {
        permissions:['*'],
        method:GET,
        path:'/config',
        callback:config[GET]
    },
    {
        permissions:['*'],
        method:GET,
        path:'/config/:config_id',
        callback:config[GET]
    },
    {
        permissions:['write:config'],
        method:PUT,
        path:'/config',
        callback:config[PUT]
    },
    {
        permissions:['write:config'],
        method:PUT,
        path:'/config/:config_id',
        callback:config[PUT]
    },
    {
        permissions:['write:config'],
        method:DELETE,
        path:'/config',
        callback:config[DELETE]
    },{
        permissions:['write:config'],
        method:POST,
        path:'/geodata/:instance/:spatial_hierarchy',
        callback:geodata[POST]
    },
    {
        permissions:['*'],
        method:GET,
        path:'/geodata',
        callback:geodata[GET]
    },
    {
        permissions:['*'],
        method:GET,
        path:'/geodata/:instance',
        callback:geodata[GET]
    },
    {
        permissions:['*'],
        method:GET,
        path:'/geodata/:instance/:spatial_hierarchy',
        callback:geodata[GET]
    },
    {
        permissions:['write:config'],
        method:PUT,
        path:'/geodata',
        callback:geodata[PUT]
    },
    {
        permissions:['write:config'],
        method:DELETE,
        path:'/geodata',
        callback:geodata[DELETE]
    }
]

module.exports = function (app, version) {
    const version_prefix = '/' + version
    _version = version

    function v(url) {
        return version_prefix + url
    }

    const make_endpoint = (endpoint) => {
        addPermission(endpoint.method, url_base(endpoint.path), endpoint.permissions)
        app[endpoint.method](v(endpoint.path), endpoint.callback)
    }

    const version_path_regex = new RegExp(version_prefix)
    app.use(version_path_regex, Auth.authMiddleware)
    app.use(version_path_regex, Auth.endpointPermissionsMiddleware)
    app.use(version_path_regex, Auth.optionsMiddleware)

    endpoints.forEach(make_endpoint)
}
