module.exports = {
  get_all(req, res) {
    const records = req.db.collection("records")

    let country = req.query.country

    records
      .find({country: country})
      .sort({recorded_at: -1})
      .toArray((err, docs) => {
        if (err) {
          res.status(403).send(err)
        }
        res.send(docs)
      })
  },
  create(req, res) {
    const records = req.db.collection("records")

    let doc = req.body
    
    records
      .insertOne(doc)
      .then((result) => {
        res.send(result.ops)
      })
      .catch(err => {
        res.status(403).send(err)
      }) 
  }
}