module.exports = {
    async get(req, res) {
        const geojson_collection = req.db.collection('geojson');
        const {instance, spatial_hierarchy} = req.params;
        try {
            if(spatial_hierarchy){
                const _id = `${instance}/${spatial_hierarchy}`
                res.send(await geojson_collection.find({_id}).toArray())
            }else if(instance){
                res.send(await geojson_collection.find({instance}).toArray())
            }else {
                res.send(await geojson_collection.find({}).toArray())
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
        const {instance, spatial_hierarchy} = req.params;
        try {
            await geojson_collection.removeOne({_id: `${instance}/${spatial_hierarchy}`})
            await geojson_collection.insertOne({
                _id: `${instance}/${spatial_hierarchy}`,
                instance,
                spatial_hierarchy,
                geojson_data:req.body
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