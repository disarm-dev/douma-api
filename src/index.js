const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
const Raven = require("raven");
const compression = require('compression')

const API_VERSIONS = ['v1', 'v2', 'v3']

Raven.config("https://ed8917e61540404da408a2a9efba0002:d99248fd72c140398999c7302e1da94b@sentry.io/138843")
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


if (!process.env.MONGODB_URI) {
  console.log(
    '\nERROR: Missing `MONGODB_URI`.\nNeed to set MONGODB_URI as an environment variable.\nSomething like `set -x MONGODB_URI "mongodb://douma-api:[secret]@mongodb.disarm.io/irs_record"`\n'
  );
  process.exit();
}

// TODO: @refac to remove need to connect to MongoDB for API versions >3
MongoClient.connect(process.env.MONGODB_URI)
  .then(db => {
    console.log("Connected to db");

    API_VERSIONS.map(v => {
      const version_routes = require(`./${v}/index`)
      return version_routes(app, db, v)
    })

    // TODO: @refac Move into the versioned API
    // CORS config
    // TODO: @refac Do we need this as well as the `cors` package?
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
      const data = "DOUMA API"
      res.send({data});
    });

    app.use(Raven.errorHandler());

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        "[DOUMA API] Listening on port " + (process.env.PORT || 3000)
      );
    });

})