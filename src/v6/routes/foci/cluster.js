const ObjectID = require('mongodb').ObjectID
const get = require('lodash').get
const {decorate_incoming_document} = require('../../lib/decorate_incoming_document')
const {validate_case_cluster} = require('../../lib/schema_validation')


async function create(req, res) {
    const cluster = req.db.collection('cluster')
    let doc = req.body
    const decorated = decorate_incoming_document({doc, req})

    try {
        validate_case_cluster(decorated)
        let inserted = await cluster.insertOne(decorated)
        res.status(201).send(inserted)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

async function get_all(req, res) {
    const cluster = req.db.collection('cluster')
    const country = req.country
    const personalised_instance_id = req.personalised_instance_id

    cluster
        .find({personalised_instance_id})
        .sort({recorded_at: -1})
        .toArray((err, docs) => {
            if (err) res.status(403).send(err)
            res.send(docs)
        })
}

async function count(req, res) {
    const cluster = req.db.collection('cluster')
    const country = req.country
    const personalised_instance_id = req.personalised_instance_id

    cluster
        .find({personalised_instance_id})
        .sort({recorded_at: -1})
        .toArray((err, docs) => {
            if (err) res.status(403).send(err)
            res.status(200).send({count:docs.length})
        })
}

async function update(req, res) {
    const cluster = req.db.collection('cluster')
    let doc = req.body
    let _id = ObjectID(doc._id)
    delete doc._id

    console.log('Document _id', _id)

    const decorated = decorate_incoming_document({doc, req})

    try {
        let _doc = await cluster.updateOne({_id}, {$set: {decorated}})
        res.status(200).send(_doc)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }

}

async function delete_cluster(req, res) {
    console.log('Delete cluster')
    const cluster = req.db.collection('cluster')
    let query = req.body;
    try {
        const result = await cluster.removeMany(query)
        res.send(result)
    } catch (e) {
        res.status(500).send(e.toString())
    }
}

module.exports = {
    create,
    get_all,
    update,
    delete_cluster,
    count
}
