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

const get_instance_config = async (instance_slug) => {
  const url = `${root_url(instance_slug)}/static/instances/${instance_slug}/config/${instance_slug}.instance.json`

  try {
    const res = await fetch(url)
    const instance_config = await res.json()
    return instance_config
  } catch(e) {
    console.error(e)
  }
}

const get_geodata = async (instance_slug) => {
  const geodata = {}
  const instance_config = await get_instance_config(instance_slug)

  const levels = instance_config.spatial_hierarchy.levels

  for (level of levels) {
    const url = `${root_url(instance_slug)}/static/instances/${instance_slug}/spatial_hierarchy/${instance_slug}.${level.name}.geojson`

    const response = await fetch(url)
    const response_json = await response.json()
    geodata[level.name] = response_json
  }

  return geodata
}


module.exports = {get_geodata, get_instance_config}