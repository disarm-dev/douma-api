const run_model = require('./run_model')
const config = require('./model')

const ObjectID = require('mongodb').ObjectID
const get = require('lodash').get
const {decorate_incoming_document} = require('../lib/decorate_incoming_document')
const {validate_case_cluster} = require('../lib/schema_validation')


async function generate_foci(req, res) {
    const case_point = req.db.collection('case_point')
    const cluster = req.db.collection('cluster')
    const country = req.country
    const personalised_instance_id = req.personalised_instance_id

    case_point
        .find({personalised_instance_id})
        .sort({recorded_at: -1})
        .toArray(async (err, docs) => {
            if (err) res.status(403).send(err)
            //console.log(docs.length)
            try {
                let input = JSON.parse(JSON.stringify(docs))
                let result = await run_model({input, config})
                for (doc of result.cluster) {
                    doc.investigation_status = 'suggested'
                    doc.status = 'active'
                    try {
                       // const decorated = decorate_incoming_document({doc, req})
                        validate_case_cluster(doc)
                        let inserted = await cluster.insertOne(doc)
                       // console.log('Saved Cluster', inserted)
                    } catch (e) {
                        console.log('Failed to insert cluster', e)
                    }
                }
                res.send({result: 'success'})
            } catch (e) {
                console.log('Error', e)
                res.status(5000).send({result: 'success'})
            }
        })
}

module.exports = {
    generate_foci
}