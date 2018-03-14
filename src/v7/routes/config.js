module.exports = {
    async get(req, res) {
        const config_collection = req.db.collection('config');
        const config_id = req.params.config_id
        try {
            if (config_id) {//
                if (config_id.indexOf('@')>0) {
                    console.log(config_id.indexOf('@'))
                    res.send(await config_collection.find({_id: config_id}).toArray());
                } else {
                    console.log('config_id')
                    res.send(await config_collection.find({'config_id':'bwa'}).toArray());
                }
            } else {
                res.send(await config_collection.find({}).toArray());
            }
        }catch(e) {
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