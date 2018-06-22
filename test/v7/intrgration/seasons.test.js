import {app} from "../../../src/api";

const express = require('express')
const request = require('supertest');
const body_parser = require('body-parser')
const test = require('ava').test
//const collections = require('../../../../src/v7/lib/collections')
const {tear_down, populate_responses, keys} = require('../helper')

const send_config = async (cfg) => {

    const res = await request(app).post('/v7/config?country=all')
        .set('Api-Key', keys.admin_key)
        .send(cfg)
    console.log(res.body)
}


test.beforeEach(async () => {
    tear_down()
})


test.serial('Update Seasons', async t => {
    const bwa_config = require('../../bwa-config')
    const initial_length = bwa_config.config_data.applets.irs_monitor.season_start_dates.length;

    await send_config(bwa_config)
    //get config
    const res = await request(app).get('/v7/config/bwa?country=all')

    //Add A date on the seasons
    let config = res.body;
    config.applets.irs_monitor.season_start_dates.push('2018-04-05')
    await send_config({config_data:config})

    const update =  await request(app).get('/v7/config/bwa?country=all')
    const updated_config = update.body;

    const updated_length = updated_config.applets.irs_monitor.season_start_dates.length;

    t.is(initial_length,updated_length-1);
})