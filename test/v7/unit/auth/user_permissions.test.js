import test from 'ava'
import request from 'supertest'
import {app} from '../../../../src/api'
const {tear_down, populate_responses, keys} = require('../../helper')



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

    const res = await request(app).get('/v7/plan/current?country=swz').set('Api-Key', keys.novice_key)

    t.is(res.status, 401)
})

test('GET /v7/plan/current with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v7/plan/current?country=swz').set('Api-Key', keys.admin_key)
   // console.log('Body',res.body)
    t.is(res.status, 200)
})


test('Test For getting a specific plan', async t =>{
    const res = await request(app).get('/v7/plan/list?country=swz').set('Api-Key',keys.admin_key)
    //console.log('res body',res.body)
    t.is(res.status, 200)
})

test.skip('Test for getting a plan by id', async t =>{
    const res = await request(app).get('/v7/plan/detail?country=swz').set('Api-Key',keys.admin_key)
   // console.log('res body',res.body)
    t.is(res.status, 200)
})

