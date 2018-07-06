const {filter_plan_targets_for_focus_area, find_latest_plan} = require('../lib/plan_helper')
const {decorate_incoming_document} = require('../lib/decorate_incoming_document')
const ObjectID = require('mongodb').ObjectID


module.exports = {
  get_current(req, res) {
    find_latest_plan(req)
        .then(docs => {
          let doc = docs
          if (typeof doc === 'undefined') {
            res.send({})
          } else {
            res.send(doc)
          }
        })
        .catch(err => {
          console.log('[get_current]', err)
          if (err) res.status(403).send(err)
        })
  },

  create: async (req, res) => {
    const plans = req.db.collection('plans')
    let incoming_plan = decorate_incoming_document({doc: req.body, req})
    if (incoming_plan.focus_filter_area) {
         try {
             incoming_plan = await filter_plan_targets_for_focus_area(req, incoming_plan)
         } catch (e) {
             return res.status(400).send({message: e.message})
         }
    }

    plans
        .insertOne(incoming_plan)
        .then((result, err) => res.send(result.ops))
        .catch(err => res.status(403).send(err))
  },

  list_all: async (req, res) => {
    const plan_collection = req.db.collection('plans')
    const country = req.country
    const personalised_instance_id = req.personalised_instance_id
    plan_collection
        .find({country, personalised_instance_id})
        .sort({updated_at: -1})
        .toArray()
        .then(plans => res.send(plans.map((plan) => {
          return {
            _id: plan._id,
            targets: plan.targets.length,
            date: plan.updated_at,
            name: plan.name
          }
        })))
        .catch(e => res.status(500).send(e))

    //console.log('Plans ',plans)
    //res.status(200).send(plans)

  },
  plan_by_id: async (req, res) => {
    console.log('Plan By ID', req.params.plan_id)
    try {
      const plan_collection = req.db.collection('plans')
      const plan_id = req.params.plan_id
      plan_collection
          .findOne({_id: ObjectID(plan_id)}, (error, doc) => {
            if (error) {
              cosole.log('Error', error)
              res.status(500).send('Internal Server Error')
            } else {
              console.log('Doc', doc)
              res.send(doc)
            }
          })
    }
    catch (e) {
      console.log('Internal error', e)
      res.status(500).send('Internal Server Error')
    }

  },
  update: async (req, res) => {
    try {
      let {_id} = req.params
      const plan_collection = req.db.collection('plans')
      let incoming_plan = decorate_incoming_document({doc: req.body, req})
      plan_collection
          .findOne({_id: ObjectID(_id)})
          .then(async current_plan => {
            if (incoming_plan.focus_filter_area) {
              try {
                console.log('Current Plan ', current_plan)
                incoming_plan = await filter_plan_targets_for_focus_area(req, incoming_plan, current_plan)
              } catch (e) {
                console.log('Current Plan ', e)
                return res.status(400).send({message: e})
              }
            }

            delete incoming_plan._id
            plan_collection.updateOne({_id: ObjectID(_id)}, {...incoming_plan})
                .then(saved => res.send(saved))
                .catch(error => res.status(500).send('There was an error while saving'))
          })
          .catch(error => {
            console.log('404', error)
            res.status(404).send('Plan could not be found')
          })

    }
    catch (e) {
      console.log('Internal Server Error', e)
      res.status(500).send('Internal server error')
    }
  },
  remove: async (req, res) => {
    try {
      let {_id} = req.params
      const plan_collection = req.db.collection('plans')
      plan_collection.deleteOne({_id: ObjectID(_id)})
          .then(result => res.send(result))
          .catch(error => res.status(500).send('Internal Server Error'))
    }
    catch (e) {
      res.status(500).send('Internal Server Error')
    }
  }

}


