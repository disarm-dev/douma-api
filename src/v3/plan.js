module.exports = {
  get_current(db, req, res) {
    const plans = db.collection("plans")

    // TODO: @feature Need to add this to every request. Some auth or scoping middleware needed.
    const country = req.query.country
    const personalised_instance_id = req.query.personalised_instance_id || 'default'

    if (!country) res.status(400).send('Country parameter missing')

    plans
      .find({country, personalised_instance_id})
      .sort({planned_at: -1})
      .limit(1)
      .toArray((err, docs) => {
        if (err) {
          res.status(403).send(err)
        }
        let doc = docs[0] || {}
        res.send(doc)
      });
  },

  create(db, req, res) {
    const plans = db.collection("plans")

    let doc = req.body

    plans
      .insertOne(doc)
      .then((result, err) => {
        res.send(result.ops)
      }).catch(err => {
      res.status(403).send(err)
    })
  }
}