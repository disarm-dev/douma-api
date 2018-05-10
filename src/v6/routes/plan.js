const {filter_plan_targets_for_focus_area, find_latest_plan} = require('../lib/plan_helper')
const {decorate_incoming_document} = require('../lib/decorate_incoming_document')


module.exports = {
    get_current(req, res) {
        find_latest_plan(req).toArray()
            .then(docs => {
                let doc = docs[0]
                if (typeof doc === 'undefined') {
                    res.send({})
                } else {
                    res.send(doc)
                }
            })
            .catch(err => {
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
                .then(plans => res.send(plans))
                .catch(e => res.status(500).send(e))

    },
    plan_by_id: async (req,res) => {
        
    }
}


