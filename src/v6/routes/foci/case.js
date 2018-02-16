const ObjectID = require('mongodb').ObjectID
const get = require('lodash').get
const {decorate_incoming_document} = require('../../lib/decorate_incoming_document')


async function create(req, res) {
    const case_point = req.db.collection('case_point')
    let doc = req.body

    const decorated = decorate_incoming_document({doc, req})
    try {
        let inserted = await case_point.insertOne(decorated)
        res.status(201).send(inserted)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

async function create_bulk(req, res) {
    const case_point = req.db.collection('case_point')
    let docs = req.body

    const decorated = [];
    for(doc of docs){
        decorated.push( decorate_incoming_document({doc, req}))
    }

    try {
        let inserted = await case_point.insertMany(decorated)
        res.status(201).send(inserted)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

async function get_all(req, res) {
    const case_point = req.db.collection('case_point')
    const country = req.country
    const personalised_instance_id = req.personalised_instance_id

    case_point
        .find({personalised_instance_id})
        .sort({recorded_at: -1})
        .toArray((err, docs) => {
            if (err) res.status(403).send(err)
            res.send(docs)
        })
}

async function count(req, res) {
    const case_point = req.db.collection('case_point')
    const country = req.country
    const personalised_instance_id = req.personalised_instance_id

    case_point
        .find({personalised_instance_id})
        .sort({recorded_at: -1})
        .toArray((err, docs) => {
            if (err) res.status(403).send(err)
            res.status(200).send({count:docs.length})
        })
}

async function update(req, res) {
    const case_point = req.db.collection('case_point')
    let doc = req.body
    let _id = doc._id
    delete doc._id

    const decorated = decorate_incoming_document({doc, req})

    try {
        let _doc = await case_point.updateOne({_id}, decorated)
        res.status(200).send(_doc)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }

}

async function delete_case_point(req,res){
    console.log('Delete case points')
    const cluster = req.db.collection('case_point')
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
    delete_case_point,
    count,
    create_bulk
}
