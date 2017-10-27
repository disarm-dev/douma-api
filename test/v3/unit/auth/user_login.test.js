import test from 'ava'
import request from 'supertest'
import {app} from '../../../../src/api'

test('POST /v3/login without credentials => 400', async t => {
    t.plan(2)

    const res = await request(app).post('/v3/login?country=swz').send({})

    t.is(res.status, 400)
    t.true(res.text.startsWith('{"message":'))
})

test('POST /v3/login with wrong credentials => 404', async t => {
    t.plan(2)

    const creds = {
        username: 'wrong',
        password: 'user'
    }
    const res = await request(app).post('/v3/login?country=swz').send(creds)

    t.is(res.status, 404)
    t.true(res.text.startsWith('{"message":'))
})

test('POST /v3/login with correct credentials => 200', async t => {
    t.plan(4)

    const creds = {
        username: 'admin',
        password: 'password'
    }
    const res = await request(app).post('/v3/login?country=swz').send(creds)

    t.is(res.status, 200)
    t.true(res.text.length > 0)

    const user = JSON.parse(res.text)
    t.is(user.username, 'admin')
    t.is(user.key, 'apikeyadmin')
})
