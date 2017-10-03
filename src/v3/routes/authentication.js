const getCSV = require('get-csv');

function getUserData() {
  return getCSV(process.env.SHEETS_URL).then((users) => {
    return formatUserPermissions(users)
  })
}

function formatUserPermissions(users) {
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

function _authenticate_user({users, requesting_user, instance_slug}) {
  const auth_instance_user = users.find((user) => {
    const auth_user = (user.username === requesting_user.username) && (user.password === requesting_user.password)

    // username and password don't match
    if (!auth_user) return false

    // a dev user is authenticated against 'all' instances
    if (user.instance_slug === 'all') return true

    // user is authenticated for the instance
    if (user.instance_slug === instance_slug) return true
  })

  delete auth_instance_user.password

  return auth_instance_user
}


function authenticate(req, res) {
  getUserData().then((users) => {
    const requesting_user = req.body.user
    const instance_slug = req.country

    const auth_instance_user = _authenticate_user({users, requesting_user, instance_slug})

    if (auth_instance_user) {
      res.send(auth_instance_user)
    } else {
      res.status(401).send({error: 'Unknown user'});
    }
  })
}


module.exports = {
  authenticate,
  _authenticate_user
}