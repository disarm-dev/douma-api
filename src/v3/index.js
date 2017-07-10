const expressMongoDb = require('express-mongo-db')

const authenticate = require('./authentication')
const plan = require('./plan')
const record = require('./record')

module.exports = function (app, version) {
  const version_prefix = "/" + version

  app.use(expressMongoDb(process.env.MONGODB_URI))

  app.use((req, res, next) => {
    console.log("🚨 Check if user is authenticated, authorised, or has ANY permissions to do ANYTHING")

    // Must have a country (though need to TODO: @refac Rename to instance_slug or similar)
    if (!req.query.country) res.status(400).send('Country parameter missing')
    req.country = req.query.country

    // check if personalised_instance_id or set to default
    req.personalised_instance_id = req.query.personalised_instance_id || 'default'

    next()
  })


  // Auth
  app.post(version_prefix + '/auth', authenticate)

  // Plan
  app.get(version_prefix + '/plan/current', plan.get_current)
  app.post(version_prefix + '/plan/create', plan.create)

  // Records
  app.get(version_prefix + '/record/all', record.get_all)
  app.post(version_prefix + '/record/create', record.create)


}
