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

async function update(req, res) {
    const case_point = req.db.collection('case_point')
    let doc = req.body
    let id = doc.id

    const decorated = decorate_incoming_document({doc, req})

    try {
        let _doc = await case_point.updateOne({id}, decorated)
        res.status(200).send(_doc)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }

}

async function delete_case_point(req,res){
    console.log('Delete case_point')
}

module.exports = {
    create,
    get_all,
    update,
    delete_case_point
}
