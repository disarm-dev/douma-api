const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const cors = require('cors')

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
  // /cluster?ids=['123', '456']
  app.get('/clusters', (req, res) => {
    console.log('GET /clusters')

    
    let search = {}

    if (req.query.ids) {
      // Find by IDs
      const ids = JSON.parse(req.query.ids || '[]') 
      search = {_id: {$in: ids}}
      
    } else if (req.query.locations) {

      // Find by locations
      let array = []
      const locations = JSON.parse(req.query.locations || '[]') 

      locations.forEach(({location_type, name}) => {
        let obj = {}
        obj['location.' + location_type] = name
        array.push(obj)
      })

      search = {$or: array}
    }

    Clusters.find(search).toArray((err, docs) => {
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

    let search = {}

    if (req.query.ids) {
      const ids = JSON.parse(req.query.ids) //.map(id => new ObjectID(id)) //TODO: @debug fix ObjectID
      search = {_id: {$in: ids}}
    } 
    
    Tasks.find(search).toArray((err, docs) => {
      res.send({data: docs})
    })
  })

  app.post('/tasks/:id', (req, res) => {

    res.send({data: "POST Tasks" })
  })


  // Spatial Entities
  app.get('/spatial_entities', (req, res) => {
    console.log('GET /spatial_entities')

    let search = {}

    if (req.query.ids) {
      const ids = JSON.parse(req.query.ids)//.map(id => new ObjectID(id)) //TODO: @debug fix ObjectID
      search = {_id: {$in: ids}}
    } 
     
    SpatialEntities.find(search).toArray((err, docs) => {
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



