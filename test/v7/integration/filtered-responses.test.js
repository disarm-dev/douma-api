import {app} from "../../../src/api";
import request from "supertest";

const admin_key = '24e66af5c3c2b25e72ec42c51b88e676'
const {tear_down, populate_responses} = require('../helper')


const test = require('ava').test

//Insert seed responses
test.beforeEach(async () => {
    await tear_down()
  await populate_responses()
})


//test('Test For creating responses')

test('Get filtered responses', async t => {
    t.plan(2)
    const res = await request(app).get('/v7/record/filtered?country=bwa&start_date=2018-02-20T09:39:45.347Z&end_date=2018-03-27T08:11:58.410Z').set('Api-Key', admin_key)
  t.is(res.status, 200)
  const length = res.body.length
  t.true(length > 0)

})