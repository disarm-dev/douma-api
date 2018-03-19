import {app} from "../../../../src/api";

const express = require('express')
const request = require('supertest');
const body_parser = require('body-parser')
const test = require('ava').test
const collections = require('../../../../src/v7/lib/collections')

test.serial('GET /v7/config config get is open => 200', async t => {
    t.plan(1)
    const res = await request(app).get('/v7/config?country=swz')
    t.is(res.status, 200)
})

test.serial('Create A new Config ' , async t => {
    const res = await request(app).post('/v7/config?country=all')
    t.is(res.status, 201)
})