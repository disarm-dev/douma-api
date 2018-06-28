const MongoClient = require('mongodb').MongoClient;
import MongodbMemoryServer from 'mongodb-memory-server'

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
const helper = (version) => {
    const collections = require(`../../src/${version}/lib/collections`)
    const responses = require(`../${version}/response`)
    const {findByUsernamePassword} = require(`../../src/${version}/lib/auth`)

    return {
        tear_down: async () => {
            for (let col in collections) {
                console.log(col)
                const _db = await db();
                await _db.collection(collections[col]).removeMany({})
            }
        },
        populate_responses: async () => {
            try {
                const _db = await db()
                return await _db.collection(collections.RECORD)
                    .insertMany(responses)
            } catch (e) {
                throw (e)
            }

        },
        user: (user_name, password) => {
            return findByUsernamePassword(user_name, password)
        },
        set_db_uri: async() => {
            const mongod = new MongodbMemoryServer()
            const uri = await mongod.getConnectionString();
            console.log('URI ',uri)
        }
    }
}

module.exports = helper