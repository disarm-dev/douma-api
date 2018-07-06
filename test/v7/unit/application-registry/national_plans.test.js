// NATIONAL PLANS are plans where there's NO focus_filter_area set (i.e. it is null)
import test from 'ava'
import {app} from "../../../../src/api";

const request = require('supertest');
const admin_key = '24e66af5c3c2b25e72ec42c51b88e676'
let {populate_bwa_geodata, tear_down, populate_bwa_config} = require('../../helper')

test.beforeEach(async t => {
  await tear_down();
  await populate_bwa_geodata();
  await populate_bwa_config();
})

function dress_up_targets_for_request_for_national_plans(targets) {
  return {
    id: "fd1e7b6d-8ed0-4be6-b69f-dc06d84791f5",
    name:"Plan 2",
    country: "bwa",
    targets: targets,
  }
}

test.serial('Can update a national plan to add targets', async t => {
  const existing_targets = [{id: 1, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets = [{id: 1, estimated_rooms: 1, assigned_to_team_name: null}, {id: 2, estimated_rooms: 1, assigned_to_team_name: null}]
  const expected_targets = [{id: 1, estimated_rooms: 1, assigned_to_team_name: null}, {id: 2, estimated_rooms: 1, assigned_to_team_name: null}]

  const existing_plan = dress_up_targets_for_request_for_national_plans(existing_targets)
  await request(app)
      .post('/v7/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
      .send(existing_plan)

  const _id_response = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)

  const incoming_plan = dress_up_targets_for_request_for_national_plans(incoming_targets)
  await request(app)
      .put(`/v7/plan/${_id_response.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)
      .send(incoming_plan)

  const res = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
  const plan = await request(app).get(`/v7/plan/detail/${res.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)


  const final_plan_all = plan.body;
  const actual_targets = final_plan_all.targets;


  t.deepEqual(expected_targets, actual_targets);
})

test.serial('Can update a national plan to change targets', async t => {
  const existing_targets = [{id: 1, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets = [{id: 2, estimated_rooms: 1, assigned_to_team_name: null}]
  const expected_targets = [{id: 2, estimated_rooms: 1, assigned_to_team_name: null}]

  const existing_plan = dress_up_targets_for_request_for_national_plans(existing_targets)
  await request(app)
      .post('/v7/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
      .send(existing_plan)

  const _id_response = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)

  const incoming_plan = dress_up_targets_for_request_for_national_plans(incoming_targets)
  await request(app)
      .put(`/v7/plan/${_id_response.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)
      .send(incoming_plan)

  const res = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
  const plan = await request(app).get(`/v7/plan/detail/${res.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)


  const final_plan_all = plan.body;
  const actual_targets = final_plan_all.targets;


  t.deepEqual(expected_targets, actual_targets);
})

test.serial('Can update a national plan to remove targets', async t => {
  const existing_targets = [{id: 1, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets = []
  const expected_targets = []

  const existing_plan = dress_up_targets_for_request_for_national_plans(existing_targets)
  await request(app)
      .post('/v7/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
      .send(existing_plan)

  const _id_response = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)

  const incoming_plan = dress_up_targets_for_request_for_national_plans(incoming_targets)
  await request(app)
      .put(`/v7/plan/${_id_response.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)
      .send(incoming_plan)

  const res = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
  const plan = await request(app).get(`/v7/plan/detail/${res.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)


  const final_plan_all = plan.body;
  const actual_targets = final_plan_all.targets;

  t.deepEqual(expected_targets, actual_targets);
})