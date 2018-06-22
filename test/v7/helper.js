const app  = require("../../src/api");

const collections = require('../../src/v7/lib/collections')
const MongoClient = require('mongodb').MongoClient;
const responses = require('./response')
const request = require('supertest');

const keys = {
    admin_key: '99f048763394c8092d2452bc9e936dd7',
    novice_key: '04a184f1adf9b44a065d287a5d377284',
    all: '65bf0b92fb8e73e1a03e1d7c938405a9',
    fociAdmin: '8ab171b97b246e87b03ef8434c56ee3d',
    configAdmin: '27599f876ad55a65762b2b9b57f1ba31'
}

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



module.exports = {tear_down, populate_responses, keys}