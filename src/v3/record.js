module.exports = {
  create(db, req, res) {
    const records = db.collection("records")
    records.insertOne(req)
      .then((result) => res.send(result))
      .catch((error) => res.status(403).send(error))
  },

  get_all(db, req, res) {
    const records = db.collection("records")

  }
}