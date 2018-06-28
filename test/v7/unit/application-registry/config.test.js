import {app} from "../../../../src/api";

const express = require('express')
const request = require('supertest');
const body_parser = require('body-parser')
const test = require('ava').test
const collections = require('../../../../src/v7/lib/collections')
const {tear_down, populate_responses, set_db_uri} = require('../../../helpers/helper')('v7')

const novice_key = '04a184f1adf9b44a065d287a5d377284'
const admin_key  = '27599f876ad55a65762b2b9b57f1ba31'

test.beforeEach(async () => {
    await  set_db_uri()
    await tear_down()
    await populate_responses()
})

test.serial('GET /v7/config config get is open => 200', async t => {
    t.plan(1)
    const res = await request(app).get('/v7/config?country=swz')
    t.is(res.status, 200)
})

test.serial('Get the latest config version', async t => {
    const bwa_config_v1 = require('../../../bwa-config')
    const bwa_config_v2 = require('../../../bwa-config')
    const bwa_config_v3 = require('../../../bwa-config')
    bwa_config_v2.config_data.config_version = '2.0.1'
    bwa_config_v3.config_data.config_version = '3.0.0'
    const bwa1_res = await request(app).post('/v7/config?country=all').set('Api-Key',admin_key).send(bwa_config_v1)
    const bwa2_res = await request(app).post('/v7/config?country=all').set('Api-Key',admin_key).send(bwa_config_v2)
    const bwa3_res = await request(app).post('/v7/config?country=all').set('Api-Key',admin_key).send(bwa_config_v3)

    const response = await request(app).get('/v7/config/bwa?country=all')

    t.is(response.status,200)
    t.is(response.body.config_version,'3.0.0')

})

test.serial('Create A new Config ' , async t => {
    const bwa_config = require('../../../bwa-config')

    const res = await request(app).post('/v7/config?country=all')
        .set('Api-Key', admin_key)
        .send({config_data:bwa_config})

    t.is(res.status, 201)
})

test.serial('Config creation fails with 401 ' , async t => {
    const bwa_config = require('../../../bwa-config')

    const res = await request(app).post('/v7/config?country=all')
        .set('Api-Key', novice_key)
        .send({config_data:bwa_config})
    t.is(res.status, 401)
})

