const get_clusters = (DB, req, res) => {
  console.log('GET /clusters')

  let search = {}

  if (req.query.ids) {
    // Find by IDs
    const ids = JSON.parse(req.query.ids ||  '[]').map((id) => new ObjectID(id))
    search = {
      _id: {
        $in: ids
      }
    }

  } else if (req.query.locations) {

    // Find by locations
    let array = []
    const locations = JSON.parse(req.query.locations ||  '[]')

    locations.forEach(({
      location_type,
      name
    }) => {
      let obj = {}
      obj['location.' + location_type] = name
      array.push(obj)
    })

    search = {
      $or: array
    }
  } else if (req.query.exclude_ids) {
    const ids_to_exclude = JSON.parse(req.query.exclude_ids ||  '[]').map((id) => new ObjectID(id))

    search = {
      _id: {
        $nin: ids_to_exclude
      }
    }
  }

  if (req.query.demo_instance_id) {
    search.demo_instance_id = req.query.demo_instance_id
  }

  console.log(search)

  DB.Clusters.find(search).toArray((err, docs) => {
    res.send({
      data: docs
    })
  })
}


const post_clusters = (DB, req, res) => {
  console.log(res)
  console.log('POST cluster')
  if (!Array.isArray(req.body)) {
    return res.code(400).end()
  }

  let demo_instance_id = req.query.demo_instance_id

  let clusters = req.body

  let all_spatial_entity_ids = clusters.reduce((ids, cluster) => {
    return ids.concat(cluster.properties.spatial_entity_ids)
  }, [])

  let tasks_not_found = []


  DB.Tasks.find({
      'properties.spatial_entity_id': {
        $in: all_spatial_entity_ids
      },
      demo_instance_id
    })
    .toArray()
    .then((tasks) => {

      tasks_not_found = all_spatial_entity_ids.reduce((local_tasks_not_found, spatial_entity_id) => {
        if (!tasks.find(t => t.properties.spatial_entity_id === spatial_entity_id)) {

          local_tasks_not_found.push({
            _id: new ObjectID(),
            properties: {
              status: 'unvisited'
            },
            task_date: new Date(),
            task_type: "irs_record",
            demo_instance_id: demo_instance_id,
            spatial_entity_id
          })

        }

        return local_tasks_not_found
      }, [])

      const all_tasks = tasks.concat(tasks_not_found)

      if (tasks_not_found.length > 0) {
        return DB.Tasks.insert(tasks_not_found).then(() => Promise.resolve(all_tasks))
      } else {
        return Promise.resolve(all_tasks)
      }
    }).then((all_tasks) => {

      clusters.forEach((cluster) => {
        cluster.demo_instance_id = demo_instance_id
        cluster.task_ids = all_tasks.filter((task) => {
          return cluster.properties.spatial_entity_ids.includes(task.spatial_entity_id)
        }).reduce((ids, task) => {
          ids.push(task._id.toString())
          return ids
        }, [])
      })

      return DB.Clusters.insert(clusters)
    }).then((response) => {
      console.log('response', response)
      res.send({
        message: 'Success',
        insertedCount: response.insertedCount
      })
    }).catch((err) => {
      console.log(err)
    })
}


const put_clusters = (DB, req, res) => {
  console.log('PUT Clusters', req.body)
  let docs = req.body

  if (!Array.isArray(req.body)) {
    return res.status(400).end()
  }

  console.log("Count of docs to update:", docs.length)
    // TODO: @feature Set default properties

  let cluster_promises = docs.map((doc) => {
    return new Promise((resolve, reject) => {
      doc._id = new ObjectID(doc._id)
      const query = {
        _id: doc._id
      }
      const update = doc

      DB.Clusters.update(query, update, {
        upsert: false
      }, (err, response) => {
        if (err) {
          console.log(err)
          resolve({
            error: err
          })
        } else {
          resolve({
            success: response,
            _id: doc._id
          })
        }
      })
    })
  })

  Promise.all(cluster_promises)
    .then(results => {
      global.results = results
        // res.send(results)

      const results_for_client = results.reduce((output, result) => {
        if (result.hasOwnProperty('success')) {
          output.modified.push(result._id)
        } else if (result.hasOwnProperty('error')) {
          output.errors.push(result.error)
        }
        return output
      }, {
        modified: [],
        errors: []
      })

      console.log(results_for_client)

      res.send(results_for_client)
    }).catch((error) => console.error(error))
}


const delete_clusters = (DB, req, res) => {
  console.log('DELETE Clusters', req.body)

  DB.Clusters.removeMany({
    demo_instance_id: req.query.demo_instance_id
  }).then(() => {
    res.send({
      status: 'Success'
    })
  })
}


module.exports = {
  get_clusters,
  post_clusters,
  put_clusters,
  delete_clusters
}