import {app} from "../../../src/api";

const express = require('express')
const request = require('supertest');
const body_parser = require('body-parser')
const test = require('ava').test
//const collections = require('../../../../src/v7/lib/collections')
const {tear_down, populate_responses, keys} = require('../helper')

const populate_config = async () => {
    const bwa_config = require('../../bwa-config')

    const res = await request(app).post('/v7/config?country=all')
        .set('Api-Key', keys.admin_key)
        .send({config_data: bwa_config})
    console.log(res.body);
}


test.beforeEach(async () => {
    await tear_down()
    await populate_config()
    await populate_responses()
})


test.serial('Update Seasons', async t => {
    //get config
    const res = await request(app).get('/v7/config/bwa?country=all')

    //Add A date on the seasons
    let config = res.body;
    console.log('Seasons',config/*.applets.irs_monitor.season_start_dates*/)

    t.pass();
})