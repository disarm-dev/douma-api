module.exports = {
  get_current(req, res) {
    const plans = req.db.collection("plans")

    // TODO: @feature Need to add this to every request. Some auth or scoping middleware needed.
    let country = req.query.country
    if (!country) res.status(400).send('Country parameter missing')

    plans
      .find({country: country})
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

  create(req, res) {
    const plans = req.db.collection("plans")
    
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