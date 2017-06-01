module.exports = {
  get_current(db, req, res) {
    const plans = db.collection("plans")

    plans.findOne((err, docs) => {
      res.send({
        data: docs
      });
    });
  },

  create(db, req, res) {
    const plans = db.collection("plans")

  }
}