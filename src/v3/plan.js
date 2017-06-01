module.exports = {
  get_current(db, req, res) {
    const plans = db.collection("plans")

    let country = req.query.country

    plans
      .find({country: country})
      .sort({planned_at: -1})
      .limit(1)
      .toArray((err, docs) => {
        if (err) {
          res.status(403).send(err)
        }
        let doc = docs[0]
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