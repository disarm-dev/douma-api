import {app} from "../../../../src/api";

const express = require('express')
const request = require('supertest');
const body_parser = require('body-parser')
const test = require('ava').test
const collections = require('../../../../src/v7/lib/collections')

test.serial('GET /v7/plan/create config get is open => 200', async t => {
    t.plan(1)
    const res = await request(app).get('/v7/plan/create?country=swz')
    t.is(res.status, 200)
})
