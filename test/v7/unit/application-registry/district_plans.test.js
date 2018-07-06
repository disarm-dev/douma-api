// DISTRICT PLANS are plans where there's a focus_filter_area set
import test from 'ava'
import {app} from "../../../../src/api";

const request = require('supertest');
const admin_key = '24e66af5c3c2b25e72ec42c51b88e676'
let {populate_bwa_geodata, tear_down, populate_bwa_config} = require('../../helper')

test.beforeEach(async t => {
  await tear_down()
  await populate_bwa_geodata();
  await populate_bwa_config();
})

function dress_up_targets_for_request_for_district_plans(targets, district_id) {
  return {
    id: "fd1e7b6d-8ed0-4be6-b69f-dc06d84791f5",
    name: "Plan 2",
    country: "bwa",
    focus_filter_area: {"id": district_id}, // NOTE: id is not null
    targets: targets,
  }
}

const sample_area_data = [
  {
    sub_area_id: 38,
    area_id: "CHOBE",
  },
  {
    sub_area_id: 564,
    area_id: "CHOBE",
  },
  {
    sub_area_id: 358,
    area_id: "TUTUME",
  }
]

test.serial('Can update a district plan to add targets (existing in CHOBE, incoming in CHOBE)', async t => {
  const existing_targets_chobe = [{id: 38, estimated_rooms: 1, assigned_to_team_name: null}]

  const existing_plan_chobe = dress_up_targets_for_request_for_district_plans(existing_targets_chobe, "CHOBE")
  await request(app)
      .post('/v7/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
      .send(existing_plan_chobe)

  const incoming_targets_chobe = [{id: 38, estimated_rooms: 1, assigned_to_team_name: null}, {
    id: 564,
    estimated_rooms: 1,
    assigned_to_team_name: null
  }]

  const _id_response = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)

  const incoming_plan_chobe = dress_up_targets_for_request_for_district_plans(incoming_targets_chobe, "CHOBE")
  const update_result = await request(app)
      .put(`/v7/plan/${_id_response.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)
      .send(incoming_plan_chobe)



  const expected_targets_all = [
    {id: 38, estimated_rooms: 1, assigned_to_team_name: null},
    {
      id: 564,
      estimated_rooms: 1,
      assigned_to_team_name: null
    }]

  const res = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)

  const plan = await request(app).get(`/v7/plan/detail/${res.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)
  t.is(plan.status, 200)


  const final_plan_all = plan.body;
  const actual_targets_all = final_plan_all.targets;


  t.deepEqual(expected_targets_all, actual_targets_all);
})

test.serial('Can update a district plan to change targets (existing in CHOBE, incoming in CHOBE)', async t => {
  const existing_targets_chobe = [{id: 38, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets_chobe = [{id: 564, estimated_rooms: 1, assigned_to_team_name: null}]
  const expected_targets_all = [{id: 564, estimated_rooms: 1, assigned_to_team_name: null}]

  const existing_plan_chobe = dress_up_targets_for_request_for_district_plans(existing_targets_chobe, 'CHOBE')
  await request(app)
      .post('/v7/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
      .send(existing_plan_chobe)

  const _id_response = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)

  const incoming_plan_chobe = dress_up_targets_for_request_for_district_plans(incoming_targets_chobe, 'CHOBE')

  await request(app)
      .put(`/v7/plan/${_id_response.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)
      .send(incoming_plan_chobe)

  const res = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
  const plan = await request(app).get(`/v7/plan/detail/${res.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)


  const final_plan_all = plan.body;
  const actual_targets_all = final_plan_all.targets;


  t.deepEqual(expected_targets_all, actual_targets_all);
})

test.serial('Can update a district plan to remove targets (existing in CHOBE, incoming in CHOBE)', async t => {
  const existing_targets_chobe = [{id: 38, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets_chobe = []
  const expected_targets_all = []

  const existing_plan_chobe = dress_up_targets_for_request_for_district_plans(existing_targets_chobe, 'CHOBE')
  await request(app)
      .post('/v7/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
      .send(existing_plan_chobe)

  const _id_response = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)

  const incoming_plan_chobe = dress_up_targets_for_request_for_district_plans(incoming_targets_chobe, 'CHOBE')
  await request(app)
      .put(`/v7/plan/${_id_response.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)
      .send(incoming_plan_chobe)

  const res = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
  const plan = await request(app).get(`/v7/plan/detail/${res.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)


  const final_plan_all = plan.body;
  const actual_targets_all = final_plan_all.targets;


  t.deepEqual(expected_targets_all, actual_targets_all);
})

test.serial('Can update a district plan to add targets (existing in TUTUME, incoming in CHOBE)', async t => {
  const existing_targets_tutume = [{id: 358, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets_chobe = [{id: 38, estimated_rooms: 1, assigned_to_team_name: null}, {
    id: 564,
    estimated_rooms: 1,
    assigned_to_team_name: null
  }]
  const expected_targets = [
    {id: 358, estimated_rooms: 1, assigned_to_team_name: null},
    {id: 38, estimated_rooms: 1, assigned_to_team_name: null},
    {id: 564, estimated_rooms: 1, assigned_to_team_name: null},
  ]

  const existing_plan_tutume = dress_up_targets_for_request_for_district_plans(existing_targets_tutume, 'TUTUME')
  await request(app)
      .post('/v7/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
      .send(existing_plan_tutume)

  const _id_response = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)

  const incoming_plan_chobe = dress_up_targets_for_request_for_district_plans(incoming_targets_chobe, 'CHOBE')
  await request(app)
      .put(`/v7/plan/${_id_response.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)
      .send(incoming_plan_chobe)

  const res = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
  const plan = await request(app).get(`/v7/plan/detail/${res.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)


  const final_plan_all = plan.body;
  const actual_targets_all = final_plan_all.targets;


  t.deepEqual(expected_targets.sort((a, b) => a.id > b.id), actual_targets_all.sort((a, b) => a.id > b.id)); // Needs to be sorted the same way
})

test.serial('Can update a district plan to change targets (existing in TUTUME, incoming in CHOBE)', async t => {
  const existing_targets_tutume_chobe = [{id: 358, estimated_rooms: 1, assigned_to_team_name: null}, {
    id: 38,
    estimated_rooms: 1,
    assigned_to_team_name: null
  }]
  const incoming_targets_chobe = [{id: 564, estimated_rooms: 1, assigned_to_team_name: null}]
  const expected_targets = [{id: 358, estimated_rooms: 1, assigned_to_team_name: null}, {
    id: 564,
    estimated_rooms: 1,
    assigned_to_team_name: null
  }]

  const existing_plan_chobe = dress_up_targets_for_request_for_district_plans(existing_targets_tutume_chobe, 'CHOBE')
  await request(app)
      .post('/v7/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
      .send(existing_plan_chobe)

  const _id_response = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)

  const incoming_plan_chobe = dress_up_targets_for_request_for_district_plans(incoming_targets_chobe, 'CHOBE')
  await request(app)
      .put(`/v7/plan/${_id_response.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)
      .send(incoming_plan_chobe)

  const res = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
  const plan = await request(app).get(`/v7/plan/detail/${res.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)


  const final_plan_all = plan.body;
  const actual_targets_all = final_plan_all.targets;


  t.deepEqual(expected_targets.sort((a, b) => a.id > b.id), actual_targets_all.sort((a, b) => a.id > b.id));
})

test.serial('Can update a district plan to remove targets (existing in TUTUME, incoming in CHOBE)', async t => {
  const existing_targets_tutume = [{id: 358, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets_chobe = []
  const expected_targets = [{id: 358, estimated_rooms: 1, assigned_to_team_name: null}]

  const existing_plan_tutume = dress_up_targets_for_request_for_district_plans(existing_targets_tutume, 'TUTUME')
  await request(app)
      .post('/v7/plan/create?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
      .send(existing_plan_tutume)

  const _id_response = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)

  const incoming_plan_chobe = dress_up_targets_for_request_for_district_plans(incoming_targets_chobe, 'CHOBE')
  await request(app)
      .put(`/v7/plan/${_id_response.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)
      .send(incoming_plan_chobe)

  const res = await request(app).get('/v7/plan/list?personalised_instance_id=default&country=bwa&instance_slug=bwa')
      .set('Api-Key', admin_key)
  const plan = await request(app).get(`/v7/plan/detail/${res.body[0]._id}?personalised_instance_id=default&country=bwa&instance_slug=bwa`)
      .set('Api-Key', admin_key)


  const final_plan_all = plan.body;
  const actual_targets_all = final_plan_all.targets;


  t.deepEqual(expected_targets, actual_targets_all);
})