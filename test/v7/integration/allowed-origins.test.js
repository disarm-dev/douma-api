import {app} from "../../../src/api";

const request = require('supertest');
const test = require('ava').test
const {tear_down} = require('../helper')
const {findByUsernamePassword} = require('../../../src/v7/lib/auth')

test.beforeEach(async () => {
  await tear_down()
})

test.serial(`Origin not in allowed origins fail with status 403`, async t => {
  const bwa_config = require('../../bwa-config')
  const admin_key = findByUsernamePassword('configAdmin', 'passwd').key
  const bwa_res = await request(app).post('/v7/config?country=all').set('Api-Key', admin_key).send(bwa_config)
  t.is(bwa_res.status, 403)
})

test.serial(`Origin for POST config in allowed origins success with status 201`, async t => {
  const fake_origin = 'http://disarm-registry-stage.surge.sh'
  const bwa_config = require('../../bwa-config')
  const admin_key = findByUsernamePassword('configAdmin', 'passwd').key
  const bwa_res = await request(app).post('/v7/config?country=all')
      .set('Origin', fake_origin)
      .set('Api-Key', admin_key)
      .send(bwa_config)

  t.is(bwa_res.status, 201)
})