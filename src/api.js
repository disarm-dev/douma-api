const fs = require('fs');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const Raven = require("raven");
const compression = require('compression');

// Logging
const morgan = require('morgan');
const path = require('path');
const accessLogStream = fs.createWriteStream(path.join(__dirname, '..', 'log', 'access.log'), {flags: 'a'});

const API_VERSIONS = ['v3'];

// Raven.config("https://ed8917e61540404da408a2a9efba0002:d99248fd72c140398999c7302e1da94b@sentry.io/138843")
//   .install();



// Need a DB or not point trying to boot the app
if (!process.env.MONGODB_URI) {
  console.log(
    '\nERROR: Missing `MONGODB_URI`.\nNeed to set MONGODB_URI as an environment variable.\nSomething like `set -x MONGODB_URI "mongodb://douma-api:[secret]@mongodb.disarm.io/irs_record"`\n'
  );
  process.exit();
}


// Create application
const app = express();

// Configure middleware
// app.use(Raven.requestHandler());
app.use(cors());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}))

app.use(
  bodyParser.json({
    limit: "500mb"
  })
);


app.get("/", (req, res) => {
  const data = "DOUMA API"
  res.send({data});
});


// Add version-specific routes
API_VERSIONS.map(v => {
  const version_routes = require(`./${v}/index`)
  return version_routes(app, v)
})


// TODO: @refac Move CORS stuff into the versioned API

// CORS config
// TODO: @refac Do we need this as well as the `cors` package?
// app.options("/*", function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, Content-Length, X-Requested-With"
//   );
//   res.send(200);
// });


// app.use(Raven.errorHandler());
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("[DOUMA API] Listening on port " + port);
});
