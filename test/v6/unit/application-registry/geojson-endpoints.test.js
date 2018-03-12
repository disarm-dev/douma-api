const express = require('express')
const request = require('supertest');
const body_parser = require('body-parser')
const test = require('ava').test
const server = require('../../../../src/application-registry')
const geojsons = require('../../../../src/application-registry/jeojson-data')
const auth = require('../../../../src/application-registry/lib/auth')

const admin_key  = 'f93d47ef94831fdbe488f0ec16c3d99b'

function makeApp() {
    const app = express();
    app.use(body_parser.json({limit: '50mb'}));
    app.use(body_parser.json({limit: '50mb'}));
    app.use(body_parser.raw({limit: '50mb'}))
    app.use(body_parser.text({limit: '50mb'}))
    app.use(body_parser.urlencoded({extended: true, limit: '50mb'}))

   // app.use(auth.authMiddleware)
   // app.use(auth.endpointPermissionsMiddleware)
   // app.use(auth.optionsMiddleware)

    let waterline_server = new server.attach_waterline_to_express(app)

    return app;
}

test.beforeEach(async () => {
        await server.clear_geojson()
        await server.insert_geojson(geojsons)

    }
)

test.afterEach(async () => {
        await  server.clear_geojson();
    }
)


test.serial('get all geojsons', async t => {
    t.plan(2);
    let path = '/api/geojson'
    let res = await request(await makeApp())
        .get(path)
        .set('Api-Key', admin_key)
        .send();
    console.log(res.body)
    t.is(res.status, 200);
    t.true(res.body.length>0) // Result should be an array with items
})


test.skip('create new geojson', async t => {
    t.plan(2)
    let path = `/api/geojson`

    let res = await request(await makeApp())
        .post(path)
        .set('Api-Key', admin_key)
        .send(require('../jeojson-data-v2'));
    t.is(res.status, 201);
    t.is(res.body._id, 'bwa-v2')

})

test.serial('overwite an existing geojson', async t => {
    t.plan(2)
    let path = `/api/geojson/bwa/country`

    let res = await request(await makeApp())
        .post(path)
        .set('Api-Key', admin_key)
        .send(require('../../../../src/application-registry/jeojson-data-v2'));

    let copy = await request(await makeApp())
        .post(path)
        .set('Api-Key', admin_key)
        .send(require('../../../../src/application-registry/jeojson-data-v2'));

    t.is(res.status, 201);
    t.is(copy.body._id,'bwa/country')

})


test.serial('create new geojson', async t => {
    t.plan(2)
    let path = `/api/geojson/bwa/country`

    let res = await request(await makeApp())
        .post(path)
        .set('Api-Key', admin_key)
        .send(require('../../../../src/application-registry/jeojson-data-v2'));
    t.is(res.status, 201);
    t.is(res.body._id, 'bwa/country')

})


test.serial('get a specific geojson', async t => {
    t.plan(2)
    let path = `/api/geojson/test_instance/test_level`

    let res = await request(await makeApp())
        .get(path)
        .set('Api-Key', admin_key)
        .send();
    t.is(res.status, 200);
    t.is(res.body.type, 'FeatureCollection')
})


test.serial('get geojsons from a specific instance', async t => {
    t.plan(2)
    let path = `/api/geojson/test_instance`

    let res = await request(await makeApp())
        .get(path)
        .set('Api-Key', admin_key)
        .send();
    t.is(res.status, 200);
    t.deepEqual(res.body, ['test_level'])
})

test.serial('get geojsons from a specific instance with a wrong instace', async t => {
    t.plan(2)
    let path = `/api/geojson/non_existent_instance`

    let res = await request(await makeApp())
        .get(path)
        .set('Api-Key', admin_key)
        .send();
    t.is(res.status, 200);
    t.deepEqual(res.body, [])
})


