const inside = require('@turf/inside')
const centroid = require('@turf/centroid')

const {get_geodata, get_instance_config} = require('../lib/remote_data_helper')
const {get_next_level_up_from_planning_level, get_planning_level_id_field, get_planning_level_name} = require('../lib/spatial_hierarchy_helper')

const find_latest_plan = (req) => {
  const plans = req.db.collection('plans')
  const country = req.country
  const personalised_instance_id = req.personalised_instance_id

  return plans
    .find({country, personalised_instance_id})
    .sort({updated_at: -1})
    .limit(1)
}

/**
 * Mutates the incoming_plan
 * @param req
 * @param incoming_plan
 * @returns {Promise.<*>}
 */
const filter_plan_targets_for_focus_area = async (req, incoming_plan) => {
  // If no focus_filter_area

  // Get instance_config (from cache or remote)
  const instance_config = await get_instance_config(req.country)

  // Get current plan
  const result = await find_latest_plan(req)
  let current_plan = await result.toArray()
  current_plan = current_plan[0]

  if (!current_plan) {
    // No current plan, so no change to the targets
    return incoming_plan
  }

  // Bunch of ID fields
  const selection_level = get_next_level_up_from_planning_level(instance_config)
  const planning_level_name = get_planning_level_name(instance_config)
  const planning_level_id_field = get_planning_level_id_field(instance_config)

  // Get polygon for focus_filter_area
  const geodata = await get_geodata(req.country)
  const focus_filter_area_polygon = geodata[selection_level.name].features.find(feature => {
    return feature.properties[selection_level.field_name] === incoming_plan.focus_filter_area.id
  })

  if (!focus_filter_area_polygon) throw new Error(`Cannot find focus_filter_area for ${incoming_plan.focus_filter_area.id} - check instance config?`)

  // Filter out all current_plan.targets within focus_filter_area
  const targets_outside_focus_filter_area = current_plan.targets.filter(target => {
    const found_area = geodata[planning_level_name].features.find(feature => {
      return feature.properties[planning_level_id_field] === target.id
    })

    if (!found_area) {
      console.error('Cannot find polygon for', target.id, ' --- check geodata')
      return false
    }

    // Want to keep only areas NOT inside the focus_filter_area
    return !inside(centroid(found_area), focus_filter_area_polygon)
  })

  incoming_plan.targets = incoming_plan.targets.concat(targets_outside_focus_filter_area)
  return incoming_plan
}

module.exports = {find_latest_plan, filter_plan_targets_for_focus_area}
