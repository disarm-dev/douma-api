const curry = require('curry')

const authenticate = require('./authentication')
const plan = require('./plan')
const record = require('./record')

module.exports = function (app, db, version) {
  const version_prefix = "/" + version

  // Auth
  app.post(version_prefix + '/auth', authenticate)

  // Plan
  app.get(version_prefix + '/plan/current', curry(plan.get_current)(db))
  app.post(version_prefix + '/plan/create', curry(plan.create)(db))

  // Records
  app.get(version_prefix + '/record/all', curry(record.get_all)(db))
  app.post(version_prefix + '/record/create', curry(record.create)(db))
  app.post(version_prefix + '/record/create_multiple', curry(record.create_multiple)(db))
}