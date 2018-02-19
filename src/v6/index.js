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
    app.get(v(''), (req, res) => res.send({
        DOUMA_API: process.env.SOURCE_VERSION || 'DEV',
        version: version
    }))

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

    // Foci / Case clustears CRUD
    addPermission('get', '/foci/case_clusters', ['read:foci'])
    addPermission('post','/foci/case_clusters',['write:foci'])
    addPermission('put','/foci/case_clusters',['write:foci'])
    addPermission('delete','/foci/case_clusters',['write:foci'])
    addPermission('get','/foci/number_of_case_clusters',['read:foci'])
    app.get(v('/foci/number_of_case_clusters'),cluster.count)
    app.post(v('/foci/case_clusters'), cluster.create)
    app.get(v('/foci/case_clusters'), cluster.get_all)
    app.put(v('/foci/case_clusters'), cluster.update)
    app.delete(v('/foci/case_clusters'), cluster.delete_cluster)

    // Case points CRUD
    addPermission('get', '/foci/case_locations', ['read:foci'])
    addPermission('post','/foci/case_locations',['write:foci'])
    addPermission('post','/foci/case_locations/bulk',['write:foci'])
    addPermission('put','/foci/case_locations',['write:foci'])
    addPermission('delete','/foci/case_locations',['write:foci'])
    addPermission('get','/foci/number_of_case_locations',['read:foci'])
    app.get(v('/foci/number_of_case_locations'),case_location.count)
    app.post(v('/foci/case_locations'), case_location.create)
    app.post(v('/foci/case_locations/bulk'), case_location.create_bulk)
    app.get(v('/foci/case_locations'), case_location.get_all)
    app.put(v('/foci/case_locations'), case_location.update)
    app.delete(v('/foci/case_locations'), case_location.delete_case_location)

    //Foci Generation
    addPermission('post','/foci/model/run',['write:foci'])
    app.post(v('/foci/model/run'),maas.generate_foci)
}
