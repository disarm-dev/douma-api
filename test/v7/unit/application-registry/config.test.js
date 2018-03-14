import {app} from "../../../../src/api";

const express = require('express')
const request = require('supertest');
const body_parser = require('body-parser')
const test = require('ava').test
const collections = require('../../../../src/v7/lib/collections')

function makeApp() {
    const app = express();
    app.use(body_parser.json());
    app.use(body_parser.json());
    app.use(body_parser.raw())
    app.use(body_parser.text())
    app.use(body_parser.urlencoded({}))

    app.use(auth.authMiddleware)
    app.use(auth.endpointPermissionsMiddleware)
    app.use(auth.optionsMiddleware)

    return app;
}

test.skip('GET /v7/foci/case_clusters with correct api token and sufficient permissions => 200', async t => {
    t.plan(1)

    const res = await request(app).get('/v7/foci/case_clusters?country=swz').set('Api-Key', foci_key)
    t.is(res.status, 200)
})