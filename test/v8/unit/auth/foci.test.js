//Database Setup
import test from 'ava'
import request from 'supertest'
import {app} from '../../../../src/api'


const admin_key = 'f3c04df6f4380af247acf7b13a8328d8'
const power_key = '820ea90b279df4da0a2cf9dc8ece3856'
const novice_key = '04a184f1adf9b44a065d287a5d377284'
const foci_key = '8ab171b97b246e87b03ef8434c56ee3d'
const {tear_down} = require('../../helper')

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


test('GET /v8/foci/case_clusters with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v8/foci/case_clusters?country=swz').set('Api-Key', foci_key)
    t.is(res.status, 200)
})

test('PUT /v8/foci/case_clusters with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v8/foci/case_clusters?country=swz').set('Api-Key', foci_key)
    t.is(res.status, 200)
})

test('GET /v8/foci/case_locations with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v8/foci/case_locations?country=swz').set('Api-Key', foci_key)

    t.is(res.status, 200)
})

test('GET /v8/foci/case_locations with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v8/foci/case_locations?country=swz').set('Api-Key', foci_key)

    t.is(res.status, 200)
})





