// DISTRICT PLANS are plans where there's a focus_filter_area set
import test from 'ava'

function dress_up_targets_for_request_for_district_plans(targets) {
  return {
    id: "fd1e7b6d-8ed0-4be6-b69f-dc06d84791f5",
    name:"Plan 2",
    country: "bwa",

    focus_filter_area: {"id": 1}, // NOTE: id is not null
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

test.serial('Can update a district plan to add targets (in same area)', t => {
  const existing_targets_chobe = [{id: 38, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets_chobe = [{id: 38, estimated_rooms: 1, assigned_to_team_name: null}, {id: 564, estimated_rooms: 1, assigned_to_team_name: null}]
  const expected_targets_all = [{id: 38, estimated_rooms: 1, assigned_to_team_name: null}, {id: 564, estimated_rooms: 1, assigned_to_team_name: null}]
  t.true(false)
})

test.serial('Can update a district plan to change targets (in same area)', t => {
  const existing_targets_chobe = [{id: 38, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets_chobe = [{id: 564, estimated_rooms: 1, assigned_to_team_name: null}]
  const expected_targets_all = [{id: 564, estimated_rooms: 1, assigned_to_team_name: null}]
  t.true(false)
})

test.serial('Can update a district plan to remove targets (in same area)', t => {
  const existing_targets_chobe = [{id: 38, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets_chobe = []
  const expected_targets_all = []
  t.true(false)
})

test.serial('Can update a district plan to add targets (in other area)', t => {
  const existing_targets_tutume = [{id: 358, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets_chobe = [{id: 38, estimated_rooms: 1, assigned_to_team_name: null}, {id: 564, estimated_rooms: 1, assigned_to_team_name: null}]
  const expected_targets = [
    {id: 358, estimated_rooms: 1, assigned_to_team_name: null},
    {id: 38, estimated_rooms: 1, assigned_to_team_name: null},
    {id: 564, estimated_rooms: 1, assigned_to_team_name: null},
  ]
  t.true(false)
})

test.serial('Can update a district plan to change targets (in other area)', t => {
  const existing_targets_tutume_chobe = [{id: 358, estimated_rooms: 1, assigned_to_team_name: null}, {id: 38, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets_chobe = [{id: 564, estimated_rooms: 1, assigned_to_team_name: null}]
  const expected_targets = [{id: 358, estimated_rooms: 1, assigned_to_team_name: null}, {id: 564, estimated_rooms: 1, assigned_to_team_name: null}]
  t.true(false)
})

test.serial('Can update a district plan to remove targets (in other area)', t => {
  const existing_targets_tutume = [{id: 358, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets_chobe = []
  const expected_targets = [{id: 358, estimated_rooms: 1, assigned_to_team_name: null}]
  t.true(false)
})