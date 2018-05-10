const ObjectID = require('mongodb').ObjectID
const get = require('lodash').get
const {decorate_incoming_document} = require('../lib/decorate_incoming_document')

module.exports = {
    get_all(req, res) {
        const records = req.db.collection('records')

        const country = req.country
        const personalised_instance_id = req.personalised_instance_id

        records
            .find({country, personalised_instance_id})
            .sort({recorded_at: -1})
            .toArray((err, docs) => {
                if (err) res.status(403).send(err)
                res.send(docs)
            })
    },

    get_updates(req, res) {
        const records = req.db.collection('records')

        const country = req.country
        const personalised_instance_id = req.personalised_instance_id
        const last_id = req.body.last_id
        const limit = get(req, 'body.limit', 1000)

        let query
        if (last_id) {
            query = {country, personalised_instance_id, _id: {$gt: new ObjectID(last_id)}}
        } else {
            query = {country, personalised_instance_id}
        }

        records
            .find(query)
            .sort({_id: 1})
            .limit(limit)
            .toArray((err, docs) => {
                if (err) res.status(403).send(err)
                res.send(docs)
            })
    },

    async create(req, res) {
        const records = req.db.collection('records')

        let docs = req.body

        const ids = []

        for (const doc of docs) {
            if (!doc) continue
            const decorated = decorate_incoming_document({doc, req})
            try {
                await records.insertOne(decorated)
                ids.push(decorated.id)
            } catch (e) {
                if (e.code === 11000) { // 11000 is an index violation
                    ids.push(doc.id)
                } else {
                    console.error(e)
                }
            }
        }

        return res.status(201).send(ids)
    },

    async date_filtered(req, res) {
        const records = req.db.collection('records')
        const {start_date, end_date} = req.query
        const country = req.country
        const personalised_instance_id = req.personalised_instance_id

        records.find({country, personalised_instance_id})
            .toArray()
            .then(docs => {
                const _docs = docs
                    .filter(doc => new Date(doc.recorded_on) > new Date(start_date))
                    .filter(doc => new Date(doc.recorded_on) < new Date(end_date))
                res.send(_docs)
            })
            .catch(error => res.status(500).send(error))
    }
}
