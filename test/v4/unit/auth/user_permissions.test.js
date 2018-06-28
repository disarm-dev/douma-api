import test from 'ava'
import request from 'supertest'
import {app} from '../../../../src/api'


const admin_key  = 'f3c04df6f4380af247acf7b13a8328d8'
const power_key  = '820ea90b279df4da0a2cf9dc8ece3856'
const novice_key = '04a184f1adf9b44a065d287a5d377284'



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
