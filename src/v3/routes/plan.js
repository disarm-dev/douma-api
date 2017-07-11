const inside = require('@turf/inside')
const centroid = require('@turf/centroid')

const {get_geodata, get_instance_config} = require('../lib/geodata_helper')
const {get_next_level_up_from_planning_level, get_planning_level_id_field, get_planning_level_name} = require('../lib/spatial_hierarchy_helper')

module.exports = {
  get_current(req, res) {

    find_latest_plan(req).toArray()
      .then(docs => {
        let doc = docs[0]
        if (typeof doc === 'undefined') {
          res.send({})
        } else {
          res.send(doc)
        }
      })
      .catch(err => {
        if (err) res.status(403).send(err)
      })
        
  },

  create: async (req, res) => {
    const plans = req.db.collection("plans")
    let incoming_plan = req.body
    incoming_plan.personalised_instance_id = req.personalised_instance_id

    if (incoming_plan.focus_filter_area) {
      incoming_plan = await filter_plan_targets_for_focus_area(req, incoming_plan)
    }

    return res.send(incoming_plan)

    plans
      .insertOne(incoming_plan)
      .then((result, err) => res.send(result.ops))
      .catch(err => res.status(403).send(err))
  },

}


const find_latest_plan = (req) => {
  const plans = req.db.collection("plans")
  const country = req.country
  const personalised_instance_id = req.personalised_instance_id

  return plans
    .find({country, personalised_instance_id})
    .sort({planned_at: -1})
    .limit(1)
}


const filter_plan_targets_for_focus_area = async (req, incoming_plan) => {
  // Get instance_config (from cache or remote)
  const instance_config = await get_instance_config(req.country)

  // Get current plan
  const result = await find_latest_plan(req)
  let current_plan = await result.toArray()
  current_plan = current_plan[0]

  // Bunch of ID fields
  const selection_level = get_next_level_up_from_planning_level(instance_config)
  const planning_level_name = get_planning_level_name(instance_config)
  const planning_level_id_field = get_planning_level_id_field(instance_config)

  // Get polygon for focus_filter_area
  const geodata = await get_geodata(req.country)
  const focus_filter_area_polygon = geodata[selection_level.name].features.find(feature => {
    return feature.properties[selection_level.field_name] === incoming_plan.focus_filter_area.id
  })

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


