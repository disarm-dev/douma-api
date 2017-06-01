module.exports = {
  get_current(db, req, res) {
    const plans = db.collection("plans")

    plans.find().sort({planned_at: -1}).limit(1).toArray((err, docs) => {
      let doc = docs[0]
      res.send(doc)
    });
  },

  create(db, req, res) {
    const plans = db.collection("plans")
    
    let doc = req.body
    
    doc.planned_at = new Date()

    plans.insertOne(doc).then((result, err) => {
      res.send({'status': "success"})
    }).catch(err => {
      res.status(403).send(err)
    }) 
  }
}