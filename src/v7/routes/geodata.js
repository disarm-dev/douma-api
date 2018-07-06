module.exports = {
    async get(req, res) {
        const geodata_collection = req.db.collection('geodata');
        const {instance, spatial_hierarchy} = req.params;
        try {
            if(spatial_hierarchy){
                const _id = `${instance}/${spatial_hierarchy}`
                res.send(await geodata_collection.findOne({_id}))
            }else if(instance){
                const geodatas = await geodata_collection.find({instance}).toArray()
                res.send(geodatas.map(e => e.spatial_hierarchy))
            }else {
                res.send(await geodata_collection.find({}).toArray())
            }

        } catch (e) {
            res.status(500).send(e.message)
        }
    }
    ,
    put(req, res) {
        const geodata_collection = req.db.collection('geodata');
        try {
            res.send(req.path)
        } catch (e) {

        }
    }
    ,
    async post(req, res) {
        const geodata_collection = req.db.collection('geodata');
        const {instance, spatial_hierarchy} = req.params;
        try {
            await geodata_collection.removeOne({_id: `${instance}/${spatial_hierarchy}`})
            await geodata_collection.insertOne({
                _id: `${instance}/${spatial_hierarchy}`,
                instance,
                spatial_hierarchy,
                geodata_data:req.body
            })
            res.status(201).send({success: true})
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }

    }
    ,
    delete(req, res) {
        const geodata_collection = req.db.collection('geodata');
        try {
            res.send(req.path)
        } catch (e) {

        }
    }
}