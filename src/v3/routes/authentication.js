const getCSV = require('get-csv');

function getUserData() {
  return getCSV(process.env.SHEETS_URL).then((users) => {
    return formatUserPermissions(users)
  })
}

function formatUserPermissions (users) {
  return users.map((user) => {
    user.allowed_apps = {
      read: user.read.split(',').map(t => t.toLowerCase().trim()),
      write: user.write.split(',').map(t => t.toLowerCase().trim())
    }
    delete user.write
    delete user.read
    return user
  })
}

module.exports = function authenticate (req, res) {
  let requesting_user = req.body.user
  
  getUserData().then(users => {
    let found_user = users.find((user) => {
      return user.username === requesting_user.username
    })

    if (found_user && (found_user.password === requesting_user.password)) {
      delete found_user.password
      res.send(found_user)
    } else {
      res.status(401).send({error: 'Unknown user'});
    }
  })
}