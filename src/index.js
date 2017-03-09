const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
const Raven = require("raven");
const fetch = require("node-fetch");
const curry = require("curry");
const path = require('path')
const compression = require('compression')


const { push } = require("./push.js");
const { get_clusters, post_clusters, put_clusters, delete_clusters, count_clusters, shapefile_clusters } = require(
  "./clusters.js"
);

const R_SERVER_URL = "https://cluster.api.disarm.io"

if (!process.env.MONGODB_URI) {
  console.log(
    '\nERROR: Missing `MONGODB_URI`.\nNeed to set MONGODB_URI as an environment variable.\nSomething like `set -x MONGODB_URI "mongodb://douma-api:[secret]@mongodb.disarm.io/irs_record"`\n'
  );
  process.exit();
}

MongoClient.connect(process.env.MONGODB_URI)
  .then(db => {
    console.log("Connected to db");

    Raven.config(
        "https://ed8917e61540404da408a2a9efba0002:d99248fd72c140398999c7302e1da94b@sentry.io/138843"
      )
      .install();

    const app = express();
    app.use(Raven.requestHandler());

    app.use(cors());
    
    app.use(compression());

    app.use(
      bodyParser.json({
        limit: "500mb"
      })
    );

    let DB = {
      Clusters: db.collection("clusters"),
      Tasks: db.collection("tasks"),
      SpatialEntities: db.collection("spatial_entities"),
      SpatialEntityPoints: db.collection("spatial_entity_points")
    };

    app.options("/*", function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
      );
      res.send(200);
    });

    app.get("/", (req, res) => {
      setTimeout(
        () => res.send({
          data: "DOUMA API v0.4"
        }),
        1000
      );
    });

     /**
   * @api {get} /local_areas/:country_code Get Local Areas
   * @apiName GetLocalAreas
   * @apiGroup Local_Areas
   *
   * @apiParam {String} country_code Cluster ids
   *
   * @apiSuccess {Object} local_areas Geojson local areas
   */

    app.get('/local_areas/:country_code', function (req, res) {
      fetch(R_SERVER_URL + '/local_areas/' + req.params.country_code + '.geojson')
      .then((server_res) => server_res.json())
      .then((data) => {
        res.send(data)
      })
    })

    /**
   * @api {get} /clusters Get clusters
   * @apiName GetCluster
   * @apiGroup Clusters
   *
   * @apiParam {Array} ids Cluster ids
   * @apiParam {Array} locationObjects Location objects {location_type: 'region', name: 'Hhohho', ...}
   * @apiParam {Array} exclude_ids Cluster ids to exclude from query
   *
   * @apiSuccess {Array} clusters Array of cluster objects
   */

    const get_clusters_fn = curry(get_clusters)(DB);
    app.get("/clusters", get_clusters_fn);

    /**
   * @api {get} /clusters/shapefile Get clusters shapefile
   * @apiName GetClusterShapefile
   * @apiGroup Clusters
   *
   * @apiParam {String} cluster_id A Cluster id
   *
   * @apiSuccess {Shapefile} shapefile A shapefile for the cluster id
   */

    const shapefile_clusters_fn = curry(shapefile_clusters)(DB);
    app.get("/clusters/shapefile", shapefile_clusters_fn);


   /**
   * @api {get} /clusters/count Get Number of clusters
   * @apiName GetClustersCount
   * @apiGroup Clusters
   *
   * @apiParam {String} demo_instance_id Demo Instance Id
   * @apiParam {Object} query A Mongo Query to limit resuls
   *                  
   * @apiSuccess {Number} Number of Clusters
   */

   const count_clusters_fn = curry(count_clusters)(DB);
   app.get("/clusters/count", count_clusters_fn);

    /**
   * @api {post} /clusters Create clusters
   * @apiName CreateClusters
   * @apiGroup Clusters
   *
   * @apiParamExample {json} Request-Example: 
                    [ {"cluster_id": 1, "cluster_collection_id": "76854", "task_ids": ["7545123", "123761"], ...}]
   * @apiSuccess {Array} clusters Array of cluster objects
   */

    const post_clusters_fn = curry(post_clusters)(DB);
    app.post("/clusters", post_clusters_fn);

    /**
   * @api {put} /clusters Update clusters
   * @apiName UpdateClusters
   * @apiGroup Clusters
   *
   * @apiParamExample {json} Request-Example: 
                    [ {"cluster_id": 1, "cluster_collection_id": "76854", "task_ids": ["7545123", "123761"], ...}]
   */

    const put_clusters_fn = curry(put_clusters)(DB);
    app.put("/clusters", put_clusters_fn);

    /**
   * @api {delete} /clusters Delete clusters
   * @apiName DeleteClusters
   * @apiGroup Clusters
   *
   * @apiParamExample {json} Request-Example: 
                    [ {"cluster_id": 1, "cluster_collection_id": "76854", "task_ids": ["7545123", "123761"], ...}]
   */
    const delete_clusters_fn = curry(delete_clusters)(DB);
    app.delete("/clusters", delete_clusters_fn);

    /**
   * @api {get} /tasks Get tasks
   * @apiName GetTasks
   * @apiGroup Tasks
   *
   * @apiParam {Array} ids Task ids
   * @apiParam {Array} spatial_entity_ids Spatial entity ids or osm_ids
   *
   * @apiSuccess {Array} clusters Array of task objects
   */

    app.get("/tasks", (req, res) => {
      console.log("GET /tasks");

      let search = {};

      if (req.query.ids) {
        const ids = JSON.parse(req.query.ids).map(id => new ObjectID(id));
        search = {
          _id: {
            $in: ids
          }
        };
      } else if (req.query.spatial_entity_ids) {
        const spatial_entity_ids = JSON.parse(req.query.spatial_entity_ids);
        search = {
          spatial_entity_id: {
            $in: spatial_entity_ids
          }
        };
      }

      if (req.query.demo_instance_id) {
        search.demo_instance_id = req.query.demo_instance_id;
      }

      DB.Tasks.find(search).toArray((err, docs) => {
        res.send({
          data: docs
        });
      });
    });

    /**
   * @api {get} /tasks/count Get tasks count
   * @apiName GetTasksCount
   * @apiGroup Tasks
   *
   * @apiParamExample {json} Sending a query: 
                    {"properties.status": "visited_unsuccessful"}
   *                  
   * @apiSuccess {Number} Number of tasks
   */

    app.get("/tasks/count", (req, res) => {
      console.log("GET /tasks/count");

      let search = JSON.parse(req.query.query);

      if (req.query.demo_instance_id) {
        search.demo_instance_id = req.query.demo_instance_id;
      }

      DB.Tasks.count(search).then(number => {
        return res.send({
          count: number
        });
      });
    });

    /**
   * @api {put} /tasks Update tasks
   * @apiName UpdateTasks
   * @apiGroup Tasks
   *
   * @apiParamExample {json} Sending an Array: 
                    [ {"task_date": "14th February 2017", "task_type": "irs_record", "spatial_entity_id": "768152631"}, ...]
   */

    app.put("/tasks", (req, res) => {
      console.log("PUT Tasks", req.body);
      let docs = req.body;

      if (!Array.isArray(req.body)) {
        return res.status(400).end();
      }

      console.log("Count of docs to update:", docs.length);
      // TODO: @feature Set default properties

      let task_promises = docs.map(doc => {
        return new Promise((resolve, reject) => {
          doc._id = new ObjectID(doc._id);
          const query = {
            _id: doc._id
          };
          const update = doc;

          DB.Tasks.update(
            query,
            update,
            {
              upsert: false
            },
            (err, response) => {
              if (err) {
                console.log(err);
                resolve({
                  error: err
                });
              } else {
                resolve({
                  success: response,
                  _id: doc._id
                });
              }
            }
          );
        });
      });

      Promise.all(task_promises)
        .then(results => {
          global.results = results;
          // res.send(results)

          const results_for_client = results.reduce(
            (output, result) => {
              if (result.hasOwnProperty("success")) {
                output.modified.push(result._id);
              } else if (result.hasOwnProperty("error")) {
                output.errors.push(result.error);
              }
              return output;
            },
            {
              modified: [],
              errors: []
            }
          );

          console.log(results_for_client);

          res.send(results_for_client);
        })
        .catch(error => console.error(error));

      // DB.Tasks.insert(docs, (err, result) => {
      //   if (err) {
      //     res.send(err)
      //   } else {
      //     res.send(result)
      //   }

      // })
    });

    /**
   * @api {get} /spatial_entities Get spatial entities
   * @apiName GetSpatialEntities
   * @apiGroup SpatialEntities
   *
   * @apiParam {Array} ids Task ids
   * @apiParam {Array} spatial_entity_ids Spatial entity ids or osm_ids
   *
   * @apiSuccess {Array} clusters Array of spatial entity objects
   */
    app.get("/spatial_entities", (req, res) => {
      console.log("GET /spatial_entities");

      let search = {};

      if (req.query.ids) {
        const ids = JSON.parse(req.query.ids) //.map(i => new ObjectId(i));
        search = {
          "properties.osm_id": {
            $in: ids
          }
        };
      }

      DB.SpatialEntities.find(search).toArray((err, docs) => {
        res.send({
          data: docs
        });
      });
    });

    /**
 * @api {post} /spatial_entities Create spatial entity
 * @apiName CreateSpatialEntities
 * @apiGroup SpatialEntities
 *
 * @apiParamExample {json} Sending Array: 
                  [ {"osm_id": "123123", "polygon": {...}}, ...]
* @apiParamExample {json} Sending Object: 
                  {"osm_id": "123123", "polygon": {...}}
 */

    app.post("/spatial_entities", (req, res) => {
      console.log("POST SE", req.body);

      // TODO: @feature Set default properties

      DB.SpatialEntities.insert(req.body, (err, result) => {
        if (err) {
          res.send({
            data: "Success"
          });
        } else {
          res.send(result);
        }
      });
    });

    /**
   * @api {get} /spatial_entity_points Get spatial entity points
   * @apiName GetSpatialEntityPoints
   * @apiGroup SpatialEntityPoints
   *
   * @apiParam {Array} ids Spatial entity ids
   *
   * @apiSuccess {Array} points Array of spatial entity points
   */
    app.get("/spatial_entity_points", (req, res) => {
      console.log("GET /spatial_entity_points");

      let search = {};

      if (req.query.ids) {
        const ids = JSON.parse(req.query.ids); //.map(id => new ObjectID(id)) //TODO: @debug fix ObjectID
        search = {
          _id: {
            $in: ids
          }
        };
      }

      DB.SpatialEntityPoints.find(search).toArray((err, docs) => {
        res.send({
          data: docs
        });
      });
    });

    /**
 * @api {post} /spatial_entity_points Create spatial entity points
 * @apiName CreateSpatialEntityPoints
 * @apiGroup SpatialEntityPoints
 * @apiParamExample {json} Sending Array: 
                  [ {"type": "Feature", "properties": {...}, "geometry": {...}, ...]
 *
 */

    app.post("/spatial_entity_points", (req, res) => {
      console.log("POST /spatial_entity_points", req.body);

      // TODO: @feature Set default properties

      DB.SpatialEntityPoints.insert(req.body, (err, result) => {
        if (err) {
          res.send({
            data: "Success"
          });
        } else {
          res.send(result);
        }
      });
    });

    app.use(Raven.errorHandler());

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        "[DOUMA API] Listening on port " + (process.env.PORT || 3000)
      );
    });
})
.catch(err => console.log(err));