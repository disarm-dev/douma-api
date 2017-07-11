const fetch = require('node-fetch');

// Get country from req
// Get instance_config from cache or from remote
// Get geodata from cache or remote


const root_url = (instance_slug) => {
  if (process.env['CLIENT_APP_URL']) {
    return `https://${instance_slug}.${process.env['CLIENT_APP_URL']}`
  } else {
    return 'localhost:8080'
  }
}

const get_instance_config = async (instance_slug) => {
  const url = `http://${root_url}/static/instances/${instance_slug}.instance.json`

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
    const url = `http://${root_url}/static/geo/${instance_slug}/spatial_hierarchy/${instance_slug}.${level.name}.geojson`

    const response = await fetch(url)
    const response_json = await response.json()
    geodata[level.name] = response_json
  }

  return geodata
}

// // Test
// console.log('root_url', root_url)
// const fn = async () => {
//   const instance_slug = 'bwa'
//   const result = await get_geodata(instance_slug)
//   console.log('geodata', Object.keys(result))
// }
//
// fn()

module.exports = {get_geodata}