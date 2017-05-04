var fs = require('fs');
var path = require('path');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

if (!process.env.GOOGLE_AUTH) {
  console.log('Missing GOOGLE_AUTH environment variable')
  return
}

fs.writeFileSync(path.join(__dirname, 'key.json'), process.env.GOOGLE_AUTH)

function start () {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'key.json'), function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }
      // Authorize a client with the loaded credentials, then call the
      // Google Sheets API.

      authorize(JSON.parse(content), (auth) => {
        getRowData(auth).then((users) => {
          resolve(users)
        })
      });
    });
  })
}

function authorize(credentials, callback) {
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var redirectUrl = credentials.web.redirect_uris[1];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

function getRowData(auth) {
  var sheets = google.sheets('v4');
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: '1t2nV4B9I7TR8FUPA1d-sEN7K0hAP0DpTJJuSkW5Hym4',
      range: 'A2:J',
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var rows = response.values;
      let keys = ['_id', 'name', 'password', 'email', 'read', 'write']

      let users = response.values.map(row => {
        let user = {allowed_apps: {read: [], write: []}}

        row.map((v, i) => {
          if (['read', 'write'].includes(keys[i])) {
            user.allowed_apps[keys[i]].push(v.toLowerCase())
          } else {
            user[keys[i]] = v
          }
        })

        return user
      })
      resolve(users)
    });
  })
}

module.exports = function authenticate (req, res) {
  let requesting_user = req.body.user
  
  start().then(users => {
    let found_user = users.find((user) => {
      return user.email == requesting_user.email
    })

    if (!found_user) {
      res.status(500).send({error: 'Incorrect email'});
    }

    if (found_user.password === requesting_user.password) {
      res.send(found_user)
    } else {
      res.status(500).send({error: 'Incorrect password'});
    }
  })
}