//Database Setup
import test from 'ava'
import request from 'supertest'
import {app} from '../../../../src/api'
const foci_key = '8ab171b97b246e87b03ef8434c56ee3d'
const {tear_down} = require('../../../helpers/helper')('v7')

const setup = async function () {

}


test.beforeEach(async () => {
    await  set_db_uri()
        await tear_down()
    }
)

//Database Teardown

test.afterEach(async () => {
      //  await  server.clearModel();
    }
)


test('GET /v7/foci/case_clusters with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v7/foci/case_clusters?country=swz').set('Api-Key', foci_key)
    t.is(res.status, 200)
})

test('PUT /v7/foci/case_clusters with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v7/foci/case_clusters?country=swz').set('Api-Key', foci_key)
    t.is(res.status, 200)
})

test('GET /v7/foci/case_locations with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v7/foci/case_locations?country=swz').set('Api-Key', foci_key)

    t.is(res.status, 200)
})

test('GET /v7/foci/case_locations with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v7/foci/case_locations?country=swz').set('Api-Key', foci_key)

    t.is(res.status, 200)
})





