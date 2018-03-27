const collections = require('../../src/v7/lib/collections')
const MongoClient = require('mongodb').MongoClient;
const responses = require('./response')

const getDb = function () {
    let url = process.env.MONGODB_URI
    let _db = null;
    return function () {
        if (_db == null) {
            return new Promise(async (resolve, reject) => {
                try {
                    _db = await MongoClient.connect(url)
                    resolve(_db)
                } catch (e) {
                    reject(e)
                }
            })
        } else {
            return new Promise((resolve, reject) => {
                resolve(_db)
            })
        }
    }
}


const db = getDb()

const tear_down = async function () {
    for (let col in collections) {
        console.log(col)
        const _db = await db();
        await _db.collection(collections[col]).removeMany({})
    }
}

const populate_responses = async () => {
    try {
        const _db = await db()
        return await _db.collection(collections.RECORD)
            .insertMany(responses)
    } catch (e) {
        throw (e)
    }

}

module.exports = {tear_down, populate_responses}