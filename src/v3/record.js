module.exports = {
  create(db, req, res) {
    const records = db.collection("records")

    let doc = req.body
    
    records.insertOne(doc).then((result) => {
      res.send({'status': "success"})
    })
    .catch(err => {
      res.status(403).send(err)
    }) 
  },

  get_all(db, req, res) {
    const records = db.collection("records")

    let country = req.query.country

    records.find({country: country}).sort({recorded_at: -1}).toArray((err, docs) => {
      if (err) {
        res.status(403).send(err)
      }
      res.send(docs)
    })
  }
}