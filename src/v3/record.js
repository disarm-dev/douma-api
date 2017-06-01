module.exports = {
  create(db, req, res) {
    const records = db.collection("records")

    let doc = req.body
    
    doc.recorded_at = new Date()

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

    records.find({country: country}).toArray((err, docs) => {
      res.send(docs)
    })
  }
}