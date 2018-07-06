//Database Setup
import test from 'ava'
const collections = require('../../../../src/v7/lib/collections')
const maas = require('../../../../src/v7/maas/run_model')
const case_locations = require('../case_location_test_data')
const config = require('../../../../src/v7/maas/model')



const MongoClient = require('mongodb').MongoClient;

const getDb = function () {
    let url = process.env.MONGODB_URI
    let _db = null;
    return function() {
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
    for(let col in collections){
        const _db = await db();
        await _db.collection(collections[col]).removeMany({})
    }
}

const setup = async function () {

}


test.beforeEach(async () => {

    }
)

//Database Teardown

test.afterEach(async () => {
        //  await  server.clearModel();
    }
)


test('Model Run', async t => {
    t.plan(1)
    let result = await maas({input:case_locations, config})
    t.is(result.cluster.length,4)
})


