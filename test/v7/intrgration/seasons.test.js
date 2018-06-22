import {app} from "../../../src/api";
const request = require('supertest');
const test = require('ava').test
const {tear_down, keys} = require('../helper')

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
    //Initialise config
    const bwa_config = require('../../bwa-config')
    await send_config(bwa_config)
    const res = await request(app).get('/v7/config/bwa?country=all')

    //Add A date on the seasons
    let config = res.body;
    config.applets.irs_monitor.season_start_dates.push('2018-04-05')
    await send_config({config_data:config})

    //reload updated config
    const update =  await request(app).get('/v7/config/bwa?country=all')
    const updated_config = update.body;

    //test
    const initial_length = bwa_config.config_data.applets.irs_monitor.season_start_dates.length;
    const updated_length = updated_config.applets.irs_monitor.season_start_dates.length;
    t.is(initial_length,updated_length-1);
})