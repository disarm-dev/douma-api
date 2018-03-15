module.exports = {
    async get(req, res) {
        const config_collection = req.db.collection('config');
        const config_id = req.params.config_id
        try {
            if (config_id) {//
                if (config_id.indexOf('@') > 0) {
                    console.log(config_id.indexOf('@'))
                    res.send(await config_collection.find({_id: config_id}).toArray());
                } else {
                    const config = await config_collection.find({'config_id': 'bwa'}).toArray()
                    if (config.length) {
                        res.send(config[0]);
                    } else {
                        res.status(404).send(`There is no config for ${config_id}`)
                    }
                }
            } else {
                const configs = await config_collection.find({}).toArray()
                res.send(configs.map(cfg => {
                 return  {
                        config_id:cfg.config_id,
                        config_version:cfg.config_version
                    }
                }));
            }
        } catch (e) {
            res.status(500).send(e.message)
        }

    }
    ,
    put(req, res) {
        const config_collection = req.db.collection('config');
        try {
            console.log('put', req.path)
            res.send(req.path)
        } catch (e) {

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
            console.log('delete', req.path)
            res.send(req.path)
        } catch (e) {

        }
    }
}