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
    console.log('limit', limit)

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

  create(req, res) {
    const records = req.db.collection('records')

    let docs = req.body

    docs = docs.map((doc) => {
      return decorate_incoming_document({doc, req})
    })

    records
      .insertMany(docs)
      .then((result) => res.status(201).send(result.ops))
      .catch(err => res.status(403).send(err))
  }
}
