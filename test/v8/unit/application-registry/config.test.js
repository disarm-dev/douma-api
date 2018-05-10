import {app} from "../../../../src/api";

const express = require('express')
const request = require('supertest');
const body_parser = require('body-parser')
const test = require('ava').test
const collections = require('../../../../src/v8/lib/collections')

const novice_key = '04a184f1adf9b44a065d287a5d377284'
const admin_key  = '27599f876ad55a65762b2b9b57f1ba31'

test.serial('GET /v8/config config get is open => 200', async t => {
    t.plan(1)
    const res = await request(app).get('/v8/config?country=swz')
    t.is(res.status, 200)
})

test.serial('Create A new Config ' , async t => {
    const bwa_config = require('../../../bwa-config')

    const res = await request(app).post('/v8/config?country=all')
        .set('Api-Key', admin_key)
        .send({config_data:bwa_config})

    t.is(res.status, 201)
})

test.serial('Config creation fails with 401 ' , async t => {
    const bwa_config = require('../../../bwa-config')

    const res = await request(app).post('/v8/config?country=all')
        .set('Api-Key', novice_key)
        .send({config_data:bwa_config})
    t.is(res.status, 401)
})
