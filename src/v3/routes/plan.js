const {filter_plan_targets_for_focus_area, find_latest_plan} = require('../lib/plan_helper')

module.exports = {
  get_current(req, res) {

    find_latest_plan(req).toArray()
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

  create: async (req, res) => {
    const plans = req.db.collection("plans")
    let incoming_plan = req.body
    incoming_plan.personalised_instance_id = req.personalised_instance_id
    incoming_plan.planned_at = + new Date()

    if (incoming_plan.focus_filter_area) {
      incoming_plan = await filter_plan_targets_for_focus_area(req, incoming_plan)
    }

    plans
      .insertOne(incoming_plan)
      .then((result, err) => res.send(result.ops))
      .catch(err => res.status(403).send(err))
  }

}


