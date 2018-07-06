const ObjectID = require('mongodb').ObjectID
const get = require('lodash').get
const {decorate_incoming_document} = require('../../lib/decorate_incoming_document')
const collections = require('../../lib/collections')
//const {validate_case_location,validate_case_locations} = require('../../lib/schema_validation')



async function create(req, res) {
    const case_locations = req.db.collection(collections.CASE_LOCATIONS)
    let doc = req.body
    try {
       // validate_case_locations(doc)
        let inserted = await case_location.insertOne(doc)
        res.status(201).send(inserted)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

async function create_bulk(req, res) {
    const case_location = req.db.collection(collections.CASE_LOCATIONS)
    let docs = req.body
    try {
      //  validate_case_locations(docs)
        let inserted = await case_location.insertMany(docs)
        res.status(201).send(inserted)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

async function get_all(req, res) {
    const case_location = req.db.collection(collections.CASE_LOCATIONS)
    const country = req.country
    const personalised_instance_id = req.personalised_instance_id

    case_location
        .find({personalised_instance_id})
        .sort({recorded_at: -1})
        .toArray((err, docs) => {
           // validate_case_locations(docs)
            if (err) res.status(403).send(err)
            res.send(docs)
        })
}

async function count(req, res) {
    const case_location = req.db.collection(collections.CASE_LOCATIONS)
    const country = req.country
    const personalised_instance_id = req.personalised_instance_id

    case_location
        .find({personalised_instance_id})
        .sort({recorded_at: -1})
        .toArray((err, docs) => {
            if (err) res.status(403).send(err)
            res.status(200).send({count:docs.length})
        })
}

async function update(req, res) {
    const case_location = req.db.collection(collections.CASE_LOCATIONS)
    let doc = req.body
    let _id = doc._id
    delete doc._id

    try {
       // validate_case_location(doc)
        let _doc = await case_location.updateOne({_id}, {...doc})
        res.status(200).send(_doc)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }

}

async function delete_case_location(req,res){
    const case_location = req.db.collection(collections.CASE_LOCATIONS)
    let query = req.body;
    try {
        const result = await case_location.removeMany(query)
        res.send(result)
    } catch (e) {
        res.status(500).send(e.toString())
    }
}

module.exports = {
    create,
    get_all,
    update,
    delete_case_location,
    count,
    create_bulk
}
