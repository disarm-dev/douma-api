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

    let records_to_return = []

    for (const doc of docs) {
      if (!doc) {
        continue
      }
      try {
        const decorated = decorate_incoming_document({doc, req})
        await records.insertOne(decorated)
        records_to_return.push(decorated)
      } catch (e) {
        if (e.code === 11000) { // 11000 is an index violation
          records_to_return.push(doc)
        } else {
          console.error(e)
        }
      }
    }

    return res.status(201).send(records_to_return)
  }
}
