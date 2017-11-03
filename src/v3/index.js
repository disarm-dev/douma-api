const expressMongoDb = require('express-mongo-db')

const User = require('./lib/user')
const authenticate                  = require('./routes/authentication').authenticate
const plan                          = require('./routes/plan')
const record                        = require('./routes/record')
const assignment_plan               = require('./routes/assignment_plan')

module.exports = function (app, version) {
    const version_prefix = '/' + version

    function v(url) {
        return version_prefix + url
    }

    app.use(expressMongoDb(process.env.MONGODB_URI))
    app.use(User.optionsMiddleware)

    // Meta

    // Auth
    app.post(v('/auth'), authenticate)

    // Plan
    app.get(v('/plan/current'), plan.get_current)

    app.post(v('/plan/create'), plan.create)

    // Record
    app.get(v('/record/all'), record.get_all)
    app.post(v('/record/create'), record.create)

    // AssignmentPlan
    app.get(v('/assignment_plan/current'), assignment_plan.read)
    app.post(v('/assignment_plan/create'), assignment_plan.create)
}
