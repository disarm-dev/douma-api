module.exports = {
  async put(req, res) {
    // /seasons
    const config_id = req.body.config_id
    const config_version = req.body.config_version
    const season_start_dates = req.body.seasons_start_dates

    if (!config_id || !config_version || !season_start_dates) {
      return res.status(400).send()
    }

    const config_collection = req.db.collection('config');
    const document_id = `${config_id}@${config_version}`

    try {
      const result = await config_collection.updateOne({ _id: document_id}, {$set: {'applets.irs_monitor.season_start_dates': season_start_dates}})

       if(result.result.nModified){
           res.send(result.result)
       }else {
          throw (new Error('Config not found'))
       }


    } catch (e) {
      console.log('e', e);
      res.status(500).send({error: e.message})
    }
  }
}