import test from 'ava'
import request from 'supertest'
import {app} from '../../../../src/api'

test('GET /v3/plan/current without api token => 401', async t => {
    t.plan(2)

    const res = await request(app).get('/v3/plan/current?country=swz')

    t.is(res.status, 401)
    t.true(res.text.startsWith('{"message":'))
})

test('GET /v3/plan/current with wrong api token => 401', async t => {
    t.plan(2)

    const res = await request(app).get('/v3/plan/current?country=swz').set('Api-Key', 'wrongkey')

    t.is(res.status, 401)
    t.true(res.text.startsWith('{"message":'))
})

test('GET /v3/plan/current with correct api token and no permissions => 401', async t => {
    t.plan(1)

    const res = await request(app).get('/v3/plan/current?country=swz').set('Api-Key', 'apikeynovice')

    t.is(res.status, 401)
})

test('GET /v3/plan/current with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v3/plan/current?country=swz').set('Api-Key', 'apikeyadmin')

    t.is(res.status, 200)
})
