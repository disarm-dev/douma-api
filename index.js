const express = require('express')
const MongoClient = require('mongodb').MongoClient

const structures = require('./seed')

const app = express()

const mongoURL = 'mongodb://localhost:27017/irs_progress';

MongoClient.connect(mongoURL, (err, db) => {
  if (err) return console.log(err)

  let Clusters = db.collection('clusters')
  let Tasks = db.collection('tasks')
  let Structures = db.collection('structures')
  
  app.get('/', (req, res) => {
    res.send({data: "DOUMA API v1"})
  })

  // Clusters

  app.get('/clusters', (req, res) => {
    const location_filter = req.params.filters.location
    res.send({data: "GET Clusters"})
  })

  // TODO: @feature Needed for R Server
  // app.post('/clusters/:id', (req, res) => {
  //   res.send({data: "GET Cluster " + req.params.id })
  // })


  // Tasks
  app.get('/tasks', (req, res) => {
    const ids = req.params.filters.task_ids
    res.send({data: "GET Tasks" })
  })

  app.post('/tasks/:id', (req, res) => {
    res.send({data: "GET Tasks" })
  })


  // Spatial Entities
  app.get('/spatial_entities', (req, res) => {
    res.send({data: "GET Spatial Entities"})
  })

  // TODO: @feature Needed for R Server
  // app.post('/spatial_entities/:id', (req, res) => {
  //   res.send({data: "POST Spatial Entity " + req.params.id })
  // })



  

  app.get('/setup', (req, res) => {
    Tasks.insertMany([{a:1}, {a:2}, {a:2}]).then(() => {
      res.send({data: "All set up"})
    })

  })

  app.listen(3000, () => {
    console.log('[DOUMA API] Listening on port 3000')
  })

})



