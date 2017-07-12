module.exports = {
  read(req, res) {
    const assignment_plan = req.db.collection('assignment_plan')
    const country = req.country
    const personalised_instance_id = req.personalised_instance_id

    assignment_plan
      .find({country, personalised_instance_id})
      .sort({planned_at: -1})
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

    let incoming_assignment_plan = req.body
    // TODO: @refac Move this assignment into the client
    incoming_assignment_plan.personalised_instance_id = req.personalised_instance_id
    incoming_assignment_plan.planned_at = + new Date()

    assignment_plan
      .insertOne(incoming_assignment_plan)
      .then(result => {
        const first = result.ops[0]
        console.log('id', first._id)
        res.send(result.ops)
      })
      .catch(err => res.status(403).send(err))
  }
}