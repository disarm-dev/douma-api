const {decorate_incoming_document} = require('../lib/decorate_incoming_document')


module.exports = {
  read(req, res) {
    const assignment_plan = req.db.collection('assignment_plan')
    const country = req.country
    const personalised_instance_id = req.personalised_instance_id

    assignment_plan
      .find({country, personalised_instance_id})
      .sort({updated_at: -1})
      .limit(1)
      .toArray()
      .then(docs => {
        let doc = docs[0]
        if (typeof doc === 'undefined') {
          res.send({})
        } else {
          res.send(doc)
        }
      })
      .catch(err => {
        if (err) res.status(403).send(err)
      })
  },
  create(req, res) {
    const assignment_plan = req.db.collection('assignment_plan')
    let incoming_assignment_plan = decorate_incoming_document({doc: req.body, req})

    assignment_plan
      .insertOne(incoming_assignment_plan)
      .then(result => {
        const first = result.ops[0]
        res.send(result.ops)
      })
      .catch(err => res.status(403).send(err))
  }
}
