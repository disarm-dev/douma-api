const fetch = require('node-fetch');

// Get country from req
// Get instance_config from cache or from remote
// Get geodata from cache or remote

const root_url = 'localhost:8080'
const geodata = {}

const get_instance_config = async (instance_slug) => {
  const url = `http://${root_url}/static/instances/${instance_slug}.instance.json`

  try {
    const instance_config = await fetch(url).then(res => res.json())
    return instance_config
  } catch(e) {
    console.error(e)
  }
}

const get_geodata = async (instance_slug, instance_config) => {
  const levels = instance_config.spatial_hierarchy.levels

  for (level of levels) {
    const url = `http://${root_url}/static/geo/${instance_slug}/spatial_hierarchy/${instance_slug}.${level.name}.geojson`

    const response = await fetch(url)
    const response_json = await response.json()
    geodata[level.name] = response_json
  }

  return geodata
}

const do_both = async () => {
  const instance_slug = 'bwa'
  const instance_config = await get_instance_config(instance_slug)
  const geodata = await get_geodata(instance_slug, instance_config)
  console.log('geodata', Object.keys(geodata))
}

do_both()

// modules.export = {get_instance_config, get_geodata, do_both}