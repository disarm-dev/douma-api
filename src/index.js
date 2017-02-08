const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const cors = require('cors')

const spatial_entities = require('../seed/spatial_entities.json')
const tasks = require('../seed/tasks.json')
const clusters = require('../seed/clusters.json')

const app = express()



const mongoURL = process.env.MONGODB_URI 

MongoClient.connect(mongoURL, (err, db) => {
  if (err) return console.log(err)

  let Clusters = db.collection('clusters')
  let Tasks = db.collection('tasks')
  let SpatialEntities = db.collection('spatial_entities')

  app.use(cors())
  
  app.get('/', (req, res) => {
    res.send({data: "DOUMA API v1"})
  })

  // Clusters
  // /cluster?locations=[{location_type: region, name: Hhohho}, {location_type: region, name: Hhohho}]
  app.get('/clusters', (req, res) => {
    console.log('GET /clusters')

    let locations = JSON.parse(req.query.locations || '[]') 
    let search = []

    locations.forEach(({location_type, name}) => {
      let obj = {}
      obj['location.' + location_type] = name
      search.push(obj)
    })

    Clusters.find({$or: search}).toArray((err, docs) => {
      res.send({data: docs})
    })
  })

  // TODO: @feature Needed for R Server
  // app.post('/clusters/:id', (req, res) => {
  //   res.send({data: "GET Cluster " + req.params.id })
  // })


  // Tasks
  app.get('/tasks', (req, res) => {
    console.log('GET /tasks')
    if (!req.query.ids) {
      return res.status(500).send({error: 'Please provide spatial entity ids'})
    } 
    const ids = JSON.parse(req.query.ids).map(id => new ObjectID(id))

    Tasks.find({_id: {$in: ids}}).toArray((err, docs) => {
      res.send({data: docs})
    })
  })

  app.post('/tasks/:id', (req, res) => {

    res.send({data: "POST Tasks" })
  })


  // Spatial Entities
  app.get('/spatial_entities', (req, res) => {
    console.log('GET /spatial_entities')

    if (!req.query.ids) {
      return res.status(500).send({error: 'Please provide spatial entity ids'})
    } 
    const ids = JSON.parse(req.query.ids).map(id => new ObjectID(id))

    SpatialEntities.find({_id: {$in: ids}}).toArray((err, docs) => {
      res.send({data: docs})
    })
  })

  // TODO: @feature Needed for R Server
  // app.post('/spatial_entities/:id', (req, res) => {
  //   res.send({data: "POST Spatial Entity " + req.params.id })
  // })


  app.listen(process.env.PORT || 3000, () => {
    console.log('[DOUMA API] Listening on port ' + (process.env.PORT || 3000))
  })

})



