module.exports = {
  get_current(req, res) {
    const plans = req.db.collection("plans")

    const country = req.country
    const personalised_instance_id = req.personalised_instance_id

    plans
      .find({country, personalised_instance_id})
      .sort({planned_at: -1})
      .limit(1)
      .toArray((err, docs) => {
        if (err) res.status(403).send(err)
        console.log('docs', docs)
        let doc = docs[0] || {}
        res.send(doc)
      });
  },

  create(req, res) {
    const plans = req.db.collection("plans")
    
    let doc = req.body
    doc.personalised_instance_id = req.personalised_instance_id

    plans
      .insertOne(doc)
      .then((result, err) => res.send(result.ops))
      .catch(err => res.status(403).send(err))
  }
}