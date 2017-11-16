const ObjectID = require('mongodb').ObjectID
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
    let query
    const records = req.db.collection('records')

    const country = req.country
    const personalised_instance_id = req.personalised_instance_id
    const last_id = req.body.last_id
    if (last_id) {
    } else {
      query = {country, personalised_instance_id}
    }

    records
      .find(query)
      .sort({_id: 1})
      .limit(100)
      .toArray((err, docs) => {
        if (err) res.status(403).send(err)
        res.send(docs.map(d => {
          return {
            _id: d._id,
            updated_at: d.updated_at,
            data: d.form_data.number_structures_total
          }
        }))
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
