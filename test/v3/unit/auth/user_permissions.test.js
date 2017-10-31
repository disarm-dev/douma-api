import test from 'ava'
import request from 'supertest'
import {app} from '../../../../src/api'

const admin_key  = '8df6ce92381895e6df89e033f65031aa'
const power_key  = 'bca6d3224f8daf8f8b454824817163db'
const novice_key = 'f9f907e87f477f3ab62e603de8880b7c'

test('GET /v4/plan/current without api token => 401', async t => {
    t.plan(2)

    const res = await request(app).get('/v4/plan/current?country=swz')

    t.is(res.status, 401)
    t.true(res.text.startsWith('{"message":'))
})

test('GET /v4/plan/current with wrong api token => 401', async t => {
    t.plan(2)

    const res = await request(app).get('/v4/plan/current?country=swz').set('Api-Key', 'wrongkey')

    t.is(res.status, 401)
    t.true(res.text.startsWith('{"message":'))
})

test('GET /v4/plan/current with correct api token and no permissions => 401', async t => {
    t.plan(1)

    const res = await request(app).get('/v4/plan/current?country=swz').set('Api-Key', novice_key)

    t.is(res.status, 401)
})

test('GET /v4/plan/current with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v4/plan/current?country=swz').set('Api-Key', admin_key)

    t.is(res.status, 200)
})
