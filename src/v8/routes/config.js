module.exports = {
    async get(req, res) {
        // TODO: Split into two methods.
        // Since this is used for two endpoints, /config and /config/:config_id. It will be easier to read and maintain
        const config_collection = req.db.collection('config');
        const config_id = req.params.config_id
        try {
            if (config_id) {//
                if (config_id.indexOf('@') > 0) {
                   // console.log(config_id.indexOf('@'))
                    // TODO: use findOne, not find().toArray()[0]
                    res.send(await config_collection.find({_id: config_id}).toArray());
                } else {
                    // TODO: use findOne, not find().toArray()[0]
                    const config = await config_collection.find({config_id}).toArray()
                    if (config.length) {
                        res.send(config[0]);
                    } else {
                        res.status(404).send(`There is no config for ${config_id}`)
                    }
                }
            } else {
                // TODO: Only return one config per config_id, no need to send all versions.
                const configs = await config_collection.find({}).toArray()
                res.send(configs.map(cfg => {
                    return {
                        config_id: cfg.config_id,
                        config_version: cfg.config_version
                    }
                }));
            }
        } catch (e) {
            res.status(500).send(e.message)
        }
    }
    ,
    async put(req, res) {
        const config_collection = req.db.collection('config');
        const config_id = req.params.config_id
        const config_data = req.body.config_data ? req.body.config_data : req.body
        const config_version = config_data.config_version
        try {
            if (config_id) {// if the config id is specified as part of the path
                if (config_id.indexOf('@') > 0) { // Update one version
                    //console.log(config_id.indexOf('@'))
                    await config_collection.updateOne({_id: config_id}, {...config_data})
                    const updated_config = await config_collection.findOne({_id: config_id})
                   // console.log(updated_config)
                    res.send(updated_config);
                } else { // If there is no config id in the path then get the config id from the data
                    // TODO: Clarify what is going on here, what's happening in the else?
                    if (config_version) {
                        // TODO: you shouldn't be able to update a config with the same version, then it's not the same version.
                        // TODO: We should use the mongo ids, not create our own. We should query by config_id and config_version though.

                        await config_collection.removeOne({_id: `${req.body.config_data.config_id}@${req.body.config_data.config_version}`})
                        await config_collection.insertOne({
                            _id: `${req.body.config_data.config_id}@${req.body.config_data.config_version}`,
                            ...req.body.config_data
                        })
                        res.status(201).send({success: true})
                    } else {
                        const config = await config_collection.updateMany({config_id: config_id}, {$set: {...config_data}})
                        const updated_configs = config_collection.find({config_id: config_id}).toArray()
                        if (updated_configs.length) {
                            res.send(updated_configs);
                        } else {
                            res.status(404).send(`There is no config for ${config_id}`)
                        }
                    }
                }
            }
        } catch (e) {
            res.status(500).send(e.message)
        }
    }
    ,
    async post(req, res) {
        const config_collection = req.db.collection('config');
        const config_id = req.params['config_id'];
        if (config_id) {
            try {
                await config_collection.updateOne({_id: config_id}, {...req.body.config_data})
                res.status(201).send({success: true})
            } catch (e) {
                console.log(e)
                res.status(500).send(e)
            }
        } else {
            try {
                await config_collection.removeOne({_id: `${req.body.config_data.config_id}@${req.body.config_data.config_version}`})
                await config_collection.insertOne({
                    _id: `${req.body.config_data.config_id}@${req.body.config_data.config_version}`,
                    ...req.body.config_data
                })
                res.status(201).send({success: true})
            } catch (e) {
                console.log(e)
                res.status(500).send(e)
            }
        }

    }
    ,
    delete(req, res) {
        const config_collection = req.db.collection('config');
        try {
           // console.log('delete', req.path,req.body.query)
            const query = req.body.query
            config_collection.deleteMany(query)
                .catch(console.log)
                .then(console.log)
           // res.send(req.path)
        } catch (e) {

        }
    }
}

function get_config(){

}

function get_configs(){

}

function create_config(){

}

function update_config(){

}