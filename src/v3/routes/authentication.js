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
  const requesting_user = req.body.user
  const instance = req.country
  
  getUserData().then(users => {
    const auth_instance_user = users.find((user) => {
      const auth_user = (user.username === requesting_user.username) && (user.password === requesting_user.password)

      // username and password don't match
      if (!auth_user) return false

      // a dev user is authenticated against 'all' instances
      if (user.instance_slug === 'all') return true

      // user is authenticated for the instance
      if (user.instance_slug === req.country) return true
    })

    if (auth_instance_user) {
      delete auth_instance_user.password
      res.send(auth_instance_user)
    } else {
      res.status(401).send({error: 'Unknown user'});
    }
  })
}