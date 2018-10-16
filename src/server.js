const MongoClient = require('mongodb').MongoClient


// Need a SECRET for a bit of extra safety
if (!process.env.SECRET) {
    console.log(
        '\nERROR: Missing `SECRET`.\nNeed to set SECRET as an environment variable.\nSomething like `set -x SECRET "mysecret"`\n'
    )
    process.exit()
}

// Need a DB or no point trying to boot the app
if (!process.env.MONGODB_URI) {
    console.log(
        '\nERROR: Missing `MONGODB_URI`.\nNeed to set MONGODB_URI as an environment variable.\nSomething like `set -x MONGODB_URI "mongodb://douma-api:[secret]@mongodb.disarm.io/irs_record"`\n'
    )
    process.exit()
}

// Need at least one source of users CSV
if (!process.env.SHEETS_URL && !process.env.SHEETS_PATH) {
    console.log(
        '\nERROR: Missing `SHEETS_URL (or SHEETS_PATH)`.\nNeed to set SHEETS_URL as an environment variable.\nSomething like `set -x SHEETS_URL "https://docs.google.com/spreadsheets/d/...."`\n'
    )
    process.exit()
}

MongoClient.connect(process.env.MONGODB_URI)
    .then(db => {
        db.collection('records').ensureIndex({'id': 1}, {unique: true, background: true}).then(() => {
            console.log('created index')
            launch()
        }).catch((e) => {
            console.log('failed in created index', e)
        })
    })
    .catch(e => {
        console.log('Failed to connect to mongo and create index', e)
    })



function launch() {
    const api = require('./api').app
    const port = process.env.PORT || 3000

    api.listen(port, () => {
        console.log('[DOUMA API] Listening on port ' + port)
    })
}




