const expressMongoDb = require('express-mongo-db')

const authenticate = require('./authentication')

const plan = require('./plan')
const record = require('./record')

module.exports = function (app, db, version) {
  const version_prefix = "/" + version

  app.use(expressMongoDb(process.env.MONGODB_URI))

  // Auth
  app.post(version_prefix + '/auth', authenticate)

  // Plan
  app.get(version_prefix + '/plan/current', plan.get_current)
  app.post(version_prefix + '/plan/create', plan.create)

  // Records
  app.get(version_prefix + '/record/all', record.get_all)
  app.post(version_prefix + '/record/create', record.create)
}