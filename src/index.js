const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
const Raven = require("raven");
const compression = require('compression')

const Version1 = require('./v1/index')
const Version2 = require('./v2/index')



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


    // do stuff
    Version1(app, DB)


    app.use(Raven.errorHandler());

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        "[DOUMA API] Listening on port " + (process.env.PORT || 3000)
      );
    });

})