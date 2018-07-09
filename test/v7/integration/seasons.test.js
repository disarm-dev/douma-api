import {app} from "../../../src/api";

const request = require('supertest');
const test = require('ava').test
const {tear_down} = require('../helper')
const {findByUsernamePassword} = require('../../../src/v7/lib/auth')

const fake_origin = 'http://disarm-registry-stage.surge.sh'


test.beforeEach(async () => {
  await tear_down()
})

test.serial('Test For location Selection after saving seasons', async t => {
  await request(app).get('/v7/').send()

  const user = findByUsernamePassword('configAdmin', 'passwd')

  const expected_location_selection = {
    "villages": [{"id": 38, "name": "Suvuyti", "category": "Chobe"}, {
      "id": 377002,
      "name": "SUA PANS",
      "category": "Tutume"
    }, {"id": 34, "name": "CHANGATE", "category": "Tutume"}, {
      "id": 37,
      "name": "Chobe Forest Reserve",
      "category": "Chobe"
    }]
  }

  const bwa_config = {
    "config_data": {
      "config_id": "bwa",
      "config_version": "1.0.0",
      "applets": {
        "irs_monitor": {
          "season_start_dates": ["2017-10-01"]
        }
      },
      "instance": {
        "slug": "bwa"
      },
      "location_selection": expected_location_selection
    }
  }
  const season_start_dates = bwa_config.config_data.applets.irs_monitor.season_start_dates;
  const data = {
    config_id: bwa_config.config_data.instance.slug,
    config_version: bwa_config.config_data.config_version,
    seasons_start_dates: season_start_dates
  }

  // upload config so it exists
  const insert_response = await request(app).post('/v7/config?country=all')
      .set('Api-Key', user.key)
      .set('Origin', fake_origin)
      .send(bwa_config)
  t.is(insert_response.status, 201)


  season_start_dates.push('2018-04-05')

  const config_before_update = await request(app).get('/v7/config/bwa?country=all')

  t.is(config_before_update.status, 200)

  const seasons_result = await request(app).put('/v7/seasons?country=all')
      .set('Api-Key', user.key)
      .set('Origin', fake_origin)
      .send(data)

  t.deepEqual(seasons_result.body, {nModified: 1, n: 1, ok: 1});
  t.deepEqual(seasons_result.status, 200);

  const config_after_update = await request(app).get('/v7/config/bwa?country=all')

  const persisted_location_selection = config_after_update.body.location_selection
  t.deepEqual(expected_location_selection, persisted_location_selection)


})

// TODO: split this out into more and smaller tests
test.serial('Send only season start dates to add a season', async t => {
  await request(app).get('/v7/').send()

  const user = findByUsernamePassword('configAdmin', 'passwd')

  const bwa_config = {
    "config_data": {
      "config_id": "bwa",
      "config_version": "1.0.0",
      "applets": {
        "irs_monitor": {
          "season_start_dates": ["2017-10-01"]
        }
      },
      "instance": {
        "slug": "bwa"
      }
    }
  }

  // upload config so it exists
  await request(app).post('/v7/config?country=all')
      .set('Api-Key', user.key)
      .set('Origin', fake_origin)
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
      .set('Origin', fake_origin)
      .send(data)

  t.deepEqual(seasons_result.body, {nModified: 1, n: 1, ok: 1});
  t.deepEqual(seasons_result.status, 200);

  const config_after_update = await request(app).get('/v7/config/bwa?country=all')

  const updated_season_start_dates = config_after_update.body.applets.irs_monitor.season_start_dates
  t.deepEqual(updated_season_start_dates, season_start_dates)
})


// TODO: split this out into more and smaller tests
test.serial('Updating seasons for a config that does not exist', async t => {


  const user = findByUsernamePassword('configAdmin', 'passwd')

  const bwa_config = {
    "config_data": {
      "config_id": "bwa",
      "config_version": "1.0.0",
      "applets": {
        "irs_monitor": {
          "season_start_dates": ["2017-10-01"]
        }
      }
    }
  }

  // upload config so it exists
  await request(app).post('/v7/config?country=all')
      .set('Api-Key', user.key)
      .set('Origin', fake_origin)
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
      .set('Origin', fake_origin)
      .send(data)

  t.deepEqual(seasons_result.status, 500);

})

