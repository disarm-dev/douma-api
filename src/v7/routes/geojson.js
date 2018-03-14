module.exports = {
    async get(req, res) {
        const geojson_collection = req.db.collection('geojson');
        const geojson_id = req.params.geojson_id
        try {
            if (geojson_id) {//
                if (geojson_id.indexOf('@') > 0) {
                    console.log(geojson_id.indexOf('@'))
                    res.send(await geojson_collection.find({_id: geojson_id}).toArray());
                } else {
                    console.log('geojson_id')
                    res.send(await geojson_collection.find({'geojson_id': 'bwa'}).toArray());
                }
            } else {
                res.send(await geojson_collection.find({}).toArray());
            }
        } catch (e) {
            res.status(500).send(e.message)
        }

    }
    ,
    put(req, res) {
        const geojson_collection = req.db.collection('geojson');
        try {
            console.log('put', req.path)
            res.send(req.path)
        } catch (e) {

        }
    }
    ,
    async post(req, res) {
        const geojson_collection = req.db.collection('geojson');
        const geojson_id = req.params['geojson_id'];

        try {
            await geojson_collection.removeOne({_id: `${req.body.geojson_data.geojson_id}@${req.body.geojson_data.geojson_version}`})
            await geojson_collection.insertOne({
                _id: `${req.body.geojson_data.geojson_id}@${req.body.geojson_data.geojson_version}`,
                ...req.body.geojson_data
            })
            res.status(201).send({success: true})
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }

    }
    ,
    delete(req, res) {
        const geojson_collection = req.db.collection('geojson');
        try {
            console.log('delete', req.path)
            res.send(req.path)
        } catch (e) {

        }
    }
}