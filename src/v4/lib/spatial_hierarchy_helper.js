// If this looks familiar, it's because it's similar to the original copy-pasted from douma.app

/**
 * Something like 'AggUniCode' for SWZ or 'OBJECTID' for BWA
 * @param instance_config
 * @returns {*|string}
 */

const get_planning_level_id_field = (instance_config) => {
  const planning_level_name = instance_config.spatial_hierarchy.markers.planning_level_name // e.g. villages for NAM
  const planning_level = instance_config.spatial_hierarchy.levels.find(sp => sp.name === planning_level_name)

  if (planning_level && planning_level.hasOwnProperty('field_name')) {
    return planning_level.field_name
  } else {
    throw new Error(`Cannot find field_name for planning_level ${planning_level_name}`)
  }
}

/**
 * Something like 'villages' for NAM for 'localities' for SWZ
 */
const get_planning_level_name = (instance_config) => {
  const planning_level_name = instance_config.spatial_hierarchy.markers.planning_level_name // e.g. villages for NAM
  const planning_level = instance_config.spatial_hierarchy.levels.find(sp => sp.name === planning_level_name)
  return planning_level.name
}

const get_denominator_fields = (instance_config) => {
  return instance_config.spatial_hierarchy.markers.denominator_fields
}

const get_all_spatial_hierarchy_levels = (instance_config) => {
  return instance_config.spatial_hierarchy.levels.map(level => level.name)
}

const get_top_level_hierarchy = (instance_config) => {
  return instance_config.spatial_hierarchy.levels[0]
}


/**
 * Try to get the next lowest spatial hierarchy: e.g. clusters for localities for SWZ
 * @returns a level {fieldname, name} or `false`
 */
const get_next_level_up_from_planning_level = (instance_config) => {
  const planning_level_name = instance_config.spatial_hierarchy.markers.planning_level_name
  const levels = instance_config.spatial_hierarchy.levels

  const index = levels.findIndex(l => l.name === planning_level_name)

  return (levels[index - 1] || false)
}

/**
 * Try to get the next lowest spatial hierarchy: e.g. clusters for localities for SWZ
 * @returns a level {fieldname, name} or `false`
 */
const get_next_level_down_from_planning_level = (instance_config) => {
  const planning_level_name = instance_config.spatial_hierarchy.markers.planning_level_name
  const levels = instance_config.spatial_hierarchy.levels

  const index = levels.findIndex(l => l.name === planning_level_name)

  return (levels[index + 1] || false)
}

module.exports = {
  get_planning_level_id_field,
  get_denominator_fields,
  get_planning_level_name,
  get_all_spatial_hierarchy_levels,
  get_next_level_up_from_planning_level,
  get_next_level_down_from_planning_level,
  get_top_level_hierarchy,
}

