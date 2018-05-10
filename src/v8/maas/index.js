const run_model = require('./run_model')
const config = require('./model')

const ObjectID = require('mongodb').ObjectID
const get = require('lodash').get
const {decorate_incoming_document} = require('../lib/decorate_incoming_document')
const {validate_case_cluster} = require('../lib/schema_validation')


async function generate_foci(req, res) {
    const case_location = req.db.collection('case_location')
    const cluster = req.db.collection('case_cluster')
    const country = req.country
    const personalised_instance_id = req.personalised_instance_id

    case_location
        .find()
        .sort({recorded_at: -1})
        .toArray(async (err, docs) => {
            if (err) res.status(403).send(err)
            //console.log(docs.length)
            try {
                let input = JSON.parse(JSON.stringify(docs))
                let result = await run_model({input, config})
                delete_cluster(cluster)
                    .catch(console.log)
                    .then(async r =>{
                        for (doc of result.cluster) {
                            doc.investigation_status = 'suggested'
                            doc.status = 'active'
                            try {
                                validate_case_cluster(doc)
                                let inserted = await cluster.insertOne(doc)
                            } catch (e) {
                                console.log('Failed to insert cluster', e)
                            }
                        }
                    })
                res.send({result: 'success'})
            } catch (e) {
                console.log('Error', e)
                res.status(5000).send({result: 'success'})
            }
        })
}

async function delete_cluster(cluster_collection) {
    try {
        return await cluster_collection.removeMany({})
    } catch (e) {
        throw (e)
    }
}

module.exports = {
    generate_foci
}