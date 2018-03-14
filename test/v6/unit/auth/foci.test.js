//Database Setup
import test from 'ava'
import request from 'supertest'
import {app} from '../../../../src/api'
const collections = require('../../../../src/v6/lib/collections')

const admin_key = '58134d20b78c8b3c17cc7f811c2332a0'
const power_key = '820ea90b279df4da0a2cf9dc8ece3856'
const novice_key = '04a184f1adf9b44a065d287a5d377284'
const foci_key = 'f03b611f5c032a2dc45de336edc46e4f'
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
       // console.log(col)
        const _db = await db();
        await _db.collection(collections[col]).removeMany({})
    }
}

const setup = async function () {

}


test.beforeEach(async () => {
        await tear_down()
    }
)

//Database Teardown

test.afterEach(async () => {
      //  await  server.clearModel();
    }
)


test('GET /v6/foci/case_clusters with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v6/foci/case_clusters?country=swz').set('Api-Key', foci_key)
    t.is(res.status, 200)
})

test('PUT /v6/foci/case_clusters with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v6/foci/case_clusters?country=swz').set('Api-Key', foci_key)
    t.is(res.status, 200)
})

test('GET /v6/foci/case_locations with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v6/foci/case_locations?country=swz').set('Api-Key', foci_key)

    t.is(res.status, 200)
})

test('GET /v6/foci/case_locations with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v6/foci/case_locations?country=swz').set('Api-Key', foci_key)

    t.is(res.status, 200)
})





