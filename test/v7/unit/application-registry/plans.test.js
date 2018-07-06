import {app} from "../../../../src/api";
const {tear_down, populate_responses} = require('../../helper')

const request = require('supertest');

const test = require('ava').test


const admin_key = '24e66af5c3c2b25e72ec42c51b88e676'

test.beforeEach(async () => {
    await tear_down()
})


const plan = {
    "focus_filter_area": {"id": 8},
    "name":"plan 1",
    "targets": [{"estimated_rooms": 0, "assigned_to_team_name": null, "id": 377002}, {
        "estimated_rooms": 4560,
        "assigned_to_team_name": null,
        "id": 63
    }, {"estimated_rooms": 0, "assigned_to_team_name": null, "id": 100}, {
        "estimated_rooms": 3200,
        "assigned_to_team_name": null,
        "id": 107
    }],
    "country": "bwa",
    "id": "fd1e7b6d-8ed0-4be6-b69f-dc06d84791f5"
}


const second_plan = {
    "focus_filter_area": {"id": 8},
    "name":"Plan 2",
    "targets": [{"estimated_rooms": 0, "assigned_to_team_name": null, "id": 377002}, {
        "estimated_rooms": 4560,
        "assigned_to_team_name": null,
        "id": 63
    }],
    "country": "bwa",
    "id": "fd1e7b6d-8ed0-4be6-b69f-dc06d84791f5"
}


test.serial('POST /v7/plan/create can create new plan', async t => {
    t.plan(1)
    const res = await request(app).post('/v7/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
        .set('Api-Key', admin_key)
        .send(plan)

    t.is(res.status, 200)
})

test.serial('POST /v7/plan/list can list plans', async t => {
    t.plan(2)

    await request(app)
        .post('/v7/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
        .set('Api-Key', admin_key)
        .send(plan)
    await request(app)
        .post('/v7/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
        .set('Api-Key', admin_key)
        .send(second_plan)

    const res = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
        .set('Api-Key', admin_key)
    t.is(res.status, 200)
    t.is(res.body.length,2)

})

test.failing('Removing a target from a plan should reduce the number of targets in the plan ', async t => {
  const plan_update = {
    "focus_filter_area": {"id": 8},
    "name": "plan 1",
    "targets": [{"estimated_rooms": 0, "assigned_to_team_name": null, "id": 377002}, {
      "estimated_rooms": 4560,
      "assigned_to_team_name": null,
      "id": 63
    }],
    "country": "bwa",
    "id": "fd1e7b6d-8ed0-4be6-b69f-dc06d84791f5"
  }

  await request(app)
      .post('/v7/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
      .send(plan)

  const initial_plan = await request(app)
      .get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)

  t.is(initial_plan.body[0].targets, 4)


  const plan_id = initial_plan.body[0]._id;


  const update_request = await request(app)
      .put(`/v7/plan/${plan_id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)
      .send(second_plan)
  t.is(update_request.body.nModified, 1)

  const updated_plan = await request(app)
      .get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
  t.is(updated_plan.body[0].targets, 2)
  
})