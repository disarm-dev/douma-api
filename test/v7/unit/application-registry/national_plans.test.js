// NATIONAL PLANS are plans where there's NO focus_filter_area set (i.e. it is null)
import test from 'ava'

function dress_up_targets_for_request_for_national_plans(targets) {
  return {
    id: "fd1e7b6d-8ed0-4be6-b69f-dc06d84791f5",
    name:"Plan 2",
    country: "bwa",

    focus_filter_area: {"id": null}, // NOTE: id is null
    targets: targets,
  }
}

test.serial('Can update a national plan to add targets', t => {
  const existing_targets = [{id: 1, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets = [{id: 1, estimated_rooms: 1, assigned_to_team_name: null}, {id: 2, estimated_rooms: 1, assigned_to_team_name: null}]
  const expected_targets = [{id: 1, estimated_rooms: 1, assigned_to_team_name: null}, {id: 2, estimated_rooms: 1, assigned_to_team_name: null}]
})

test.serial('Can update a national plan to change targets', t => {
  const existing_targets = [{id: 1, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets = [{id: 2, estimated_rooms: 1, assigned_to_team_name: null}]
  const expected_targets = [{id: 2, estimated_rooms: 1, assigned_to_team_name: null}]
})

test.serial('Can update a national plan to remove targets', t => {
  const existing_targets = [{id: 1, estimated_rooms: 1, assigned_to_team_name: null}]
  const incoming_targets = []
  const expected_targets = []
})