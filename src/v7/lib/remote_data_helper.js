const fetch = require('node-fetch');

// Get country from req
// Get instance_config from cache or from remote
// Get geodata from cache or remote


const root_url = (instance_slug) => {
  if (process.env['CLIENT_APP_URL']) {
    return `https://${instance_slug}.${process.env['CLIENT_APP_URL']}`
  } else {
    return 'http://localhost:8080'
  }
}

const get_instance_config = async (req) => {
  const instance_slug = req.country
  const config_collection = req.db.collection('config');
  const config = await config_collection.findOne({ $query: { config_id: instance_slug}, $orderby: { config_version: -1 } })
  return config
}

const get_geodata = async (req) => {
  const instance_slug = req.country
  const geodata_collection = req.db.collection('geodata');
  const instance_config = await get_instance_config(req)
  const levels = instance_config.spatial_hierarchy.levels

  const geodata = {}
  for (const level of levels) {
    const geodata_level = await geodata_collection.findOne({ _id: `${instance_slug}/${level.name}`})
    geodata[level.name] = geodata_level.geodata_data
  }

  return geodata
}


module.exports = {get_geodata, get_instance_config}
