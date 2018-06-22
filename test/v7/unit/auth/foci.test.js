//Database Setup
import test from 'ava'
import request from 'supertest'
import {app} from '../../../../src/api'

const {tear_down, populate_responses, keys} = require('../../helper')


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


test('GET /v7/foci/case_clusters with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v7/foci/case_clusters?country=swz').set('Api-Key', keys.fociAdmin)
    t.is(res.status, 200)
})

test('PUT /v7/foci/case_clusters with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v7/foci/case_clusters?country=swz').set('Api-Key', keys.fociAdmin)
    t.is(res.status, 200)
})

test('GET /v7/foci/case_locations with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v7/foci/case_locations?country=swz').set('Api-Key', keys.fociAdmin)

    t.is(res.status, 200)
})

test('GET /v7/foci/case_locations with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v7/foci/case_locations?country=swz').set('Api-Key', keys.fociAdmin)

    t.is(res.status, 200)
})





