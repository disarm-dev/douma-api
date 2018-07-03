import {app} from "../../../src/api";
const request = require('supertest');
const test = require('ava').test
const {tear_down} = require('../helper')
const { findByUsernamePassword } = require('../../../src/v7/lib/auth')


test.afterEach(async () => {
    tear_down()
})

// TODO: split this out into more and smaller tests
test.serial('Send only season start dates to add a season', async t => {
    await request(app).get('/v7/').send()

    const user = findByUsernamePassword('configAdmin', 'passwd')

    const bwa_config = require('../../bwa-config')

    // upload config so it exists
    await request(app).post('/v7/config?country=all')
        .set('Api-Key', user.key)
        .send(bwa_config)

    // update season_start_dates
    const season_start_dates = bwa_config.config_data.applets.irs_monitor.season_start_dates;
    season_start_dates.push('2018-04-05')
    
    const data = {
        config_id: bwa_config.config_data.instance.slug,
        config_version: bwa_config.config_data.config_version,
        seasons_start_dates: season_start_dates
    }
    
    const seasons_result = await request(app).put('/v7/seasons?country=all')
        .set('Api-Key', user.key)
        .send(data)

    t.deepEqual(seasons_result.status, 200);
  t.deepEqual(seasons_result.body.nModified, 1);

    const config_after_update = await request(app).get('/v7/config/bwa?country=all')

    const updated_season_start_dates = config_after_update.body.applets.irs_monitor.season_start_dates
    t.deepEqual(updated_season_start_dates, season_start_dates)
})


// TODO: split this out into more and smaller tests
test.serial('Updating seasons for a config that does not exist', async t => {


    const user = findByUsernamePassword('configAdmin', 'passwd')

    const bwa_config = require('../../bwa-config')

    // upload config so it exists
    await request(app).post('/v7/config?country=all')
        .set('Api-Key', user.key)
        .send(bwa_config)

    // update season_start_dates
    const season_start_dates = bwa_config.config_data.applets.irs_monitor.season_start_dates;
    season_start_dates.push('2018-04-05')

    const data = {
        config_id: 'non_existing_slug',
        config_version: 'no_version',
        seasons_start_dates: season_start_dates
    }

    const seasons_result = await request(app).put('/v7/seasons?country=all')
        .set('Api-Key', user.key)
        .send(data)

    t.deepEqual(seasons_result.status, 500);

})

