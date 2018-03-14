import test from 'ava'
import request from 'supertest'
import {app} from '../../../../src/api'

const admin_key  = '58134d20b78c8b3c17cc7f811c2332a0'
const power_key  = '820ea90b279df4da0a2cf9dc8ece3856'
const novice_key = '04a184f1adf9b44a065d287a5d377284'
const foci_key = 'f03b611f5c032a2dc45de336edc46e4f'



test('GET /v7/plan/current without api token => 401', async t => {
    t.plan(2)

    const res = await request(app).get('/v7/plan/current?country=swz')

    t.is(res.status, 401)
    t.true(res.text.startsWith('{"message":'))
})

test('GET /v7/plan/current with wrong api token => 401', async t => {
    t.plan(2)

    const res = await request(app).get('/v7/plan/current?country=swz').set('Api-Key', 'wrongkey')

    t.is(res.status, 401)
    t.true(res.text.startsWith('{"message":'))
})

test('GET /v7/plan/current with correct api token and no permissions => 401', async t => {
    t.plan(1)

    const res = await request(app).get('/v7/plan/current?country=swz').set('Api-Key', novice_key)

    t.is(res.status, 401)
})

test('GET /v7/plan/current with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v7/plan/current?country=swz').set('Api-Key', admin_key)

    t.is(res.status, 200)
})

test('Test For getting all plans', async t =>{
    const res = await request(app).get('/v7/plan/all?country=swz').set('Api-Key',admin_key)
   // console.log('res body',res.body)
    t.is(res.status, 200)
})

test.skip('Test For getting a specific plan', async t =>{
    const res = await request(app).get('/v7/plan/single?country=swz').set('Api-Key',admin_key)
   // console.log('res body',res.body)
    t.is(res.status, 200)
})

