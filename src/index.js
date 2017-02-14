const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const cors = require('cors')
const bodyParser = require('body-parser');
const Raven = require('raven')



MongoClient.connect(process.env.MONGODB_URI).then((db) => {
  console.log('Connected to db')

  Raven.config('https://ed8917e61540404da408a2a9efba0002:d99248fd72c140398999c7302e1da94b@sentry.io/138843').install()

  const app = express()
  app.use(Raven.requestHandler())

  app.use(cors())
  app.use(bodyParser.json({limit: '50mb'}))

  let Clusters = db.collection('clusters')
  let Tasks = db.collection('tasks')
  let SpatialEntities = db.collection('spatial_entities')

  app.get('/', (req, res) => {
    res.send({data: "DOUMA API v0.3"})
  })

  app.get('/error', (req, res) => {
    throw new Error('Something crashed')
    res.send({data: "DOUMA API v0.3"})
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
  app.post('/clusters', (req, res) => {
    console.log('POST cluster', req.body)

    if (!Array.isArray(req.body)) {
      return res.status(400).end()
    }

    let clusters = req.body

    
    let cluster_promises = clusters.map((cluster) => {
      
      let task_promises = cluster.spatial_entity_ids.map((spatial_entity_id) => {
        return Tasks.find({spatial_entity_id})
          .toArray()
          .then((task) => {
            if (task.length === 0)  {
              return Tasks.insert({
                properties: {
                  status: 'unvisited'
                },
                task_date: new Date(),
                task_type: "irs_record",
                spatial_entity_id
              })
            } else {
              return new Promise((resolve, reject) => resolve())
            }
          })
      })

      return Promise.all(task_promises).then((results) => {
        let task_ids = []


        results
        .filter(r => r)
        .filter(({result}) => {
          if (result) {
            return result.ok === 1  
          }
          return false
        })
        .forEach(({insertedIds}) => {
          if (insertedIds) {
            insertedIds.forEach((id) => task_ids.push(id))  
          }
        })

        cluster.task_ids = task_ids

        return Clusters.insert(cluster)
      })
    })
    

    Promise.all(cluster_promises).then((clusters) => {
      res.send(`Inserted ${clusters.length} clusters`)
    }).catch((err) => {
      console.log('error here', err)
      res.status(500).send('Something broke!')
    })
  })


  // Tasks
  app.get('/tasks', (req, res) => {
    console.log('GET /tasks')

    let search = {}

    if (req.query.ids) {
      const ids = JSON.parse(req.query.ids) //.map(id => new ObjectID(id)) //TODO: @debug fix ObjectID
      search = {_id: {$in: ids}}
    } else if (req.query.spatial_entity_ids) {
      const spatial_entity_ids = JSON.parse(req.query.spatial_entity_ids)
      search = {spatial_entity_id: {$in: spatial_entity_ids}}
    }
    
    Tasks.find(search).toArray((err, docs) => {
      res.send({data: docs})
    })
  })

  app.post('/tasks', (req, res) => {
    console.log('POST Tasks', req.body)
    let doc = req.body

    // TODO: @feature Set default properties

    Tasks.insert(doc, (err, result) => {
      if (err) {
        res.send(err)    
      } else {
        res.send(result)
      }
      
    })
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
  app.post('/spatial_entities', (req, res) => {
    console.log('POST SE', req.body)
    let doc = req.body

    // TODO: @feature Set default properties

    SpatialEntities.insert(doc, (err, result) => {
      if (err) {
        res.send({data: req.body })    
      } else {
        res.send(result)
      }
      
    })
  })

  app.use(Raven.errorHandler())

  app.use(function (err, req, res, next) {
    res.status(500)
    res.end(res.sentry + '\n')
  })


  app.listen(process.env.PORT || 3000, () => {
    console.log('[DOUMA API] Listening on port ' + (process.env.PORT || 3000))
  })

}).catch((err) => console.log(err))


