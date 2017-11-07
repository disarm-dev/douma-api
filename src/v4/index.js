const expressMongoDb = require('express-mongo-db')

const Auth = require('./lib/auth')

const {force_refresh_geodata_cache} = require('./routes/meta')
const login = require('./routes/login')
const plan = require('./routes/plan')
const record = require('./routes/record')
const assignment_plan = require('./routes/assignment_plan')

Auth.updateUserList()

module.exports = function (app, version) {
  const version_prefix = '/' + version

  function v(url) {
    return version_prefix + url
  }

  app.use(expressMongoDb(process.env.MONGODB_URI))
  app.use(Auth.authMiddleware)
  app.use(Auth.endpointPermissionsMiddleware)
  app.use(Auth.optionsMiddleware)

  // Meta
  // This is also in openPaths
  Auth.addPermission('get', v(''), ['*'])
  app.get(v(''), (req, res) => res.send({
    DOUMA_API: process.env.SOURCE_VERSION || 'DEV',
    version: version
  }))

  Auth.addPermission('get', v('/refresh_users'), ['*'])
  app.get(v('/refresh_users'), Auth.forceUpdateUserList)
    

  // Auth
  Auth.addPermission('post', v('/login'), ['*'])
  app.post(v('/login'), login.login)

  // Plan
  Auth.addPermission('get', v('/plan/current'), ['read:irs_plan', 'read:irs_monitor', 'read:irs_tasker'])
  app.get(v('/plan/current'), plan.get_current)

  Auth.addPermission('post', v('/plan/current'), ['write:irs_plan'])
  app.post(v('/plan/create'), plan.create)

  // Record
  Auth.addPermission('get', v('/record/all'), ['read:irs_record_point', 'read:irs_monitor'])
  app.get(v('/record/all'), record.get_all)
  Auth.addPermission('post', v('/record/create'), ['write:irs_record_point'])
  app.post(v('/record/create'), record.create)

  // AssignmentPlan
  Auth.addPermission('get', v('/assignment_plan/current'), ['read:irs_tasker'])
  app.get(v('/assignment_plan/current'), assignment_plan.read)
  Auth.addPermission('post', v('/assignment_plan/create'), ['write:irs_tasker'])
  app.post(v('/assignment_plan/create'), assignment_plan.create)

}
