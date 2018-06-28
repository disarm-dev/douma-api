//Database Setup
import test from 'ava'
const maas = require('../../../../src/v6/maas/run_model')
const case_locations = require('../case_location_test_data')
const config = require('../../../../src/v6/maas/model')



test('Model Run', async t => {

    t.plan(1)
    let result = await maas({input:case_locations, config})
    t.is(result.cluster.length,4)
})


