module.exports = {
  force_refresh_geodata_cache(req, res) {
    console.log('TODO: @feature implement force_refresh_geodata_cache for', req.country)
    res.send(`Refreshing for ${req.country}.`)
  }
}
