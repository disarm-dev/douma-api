const getCSV = require('get-csv');

function getUserData() {
  return getCSV(process.env.SHEETS_URL).then((users) => {
    return users.map(u => formatUserPermissions(u))
  })
}

function formatUserPermissions(user) {
  if (!user.hasOwnProperty('read') || !user.hasOwnProperty('write')) return {}

  user.allowed_apps = {
    read: user.read.split(',').map(t => t.toLowerCase().trim()),
    write: user.write.split(',').map(t => t.toLowerCase().trim())
  }
  delete user.write
  delete user.read
  return user
}

function _authenticate_user({users, requesting_user, instance_slug}) {
  const auth_instance_user = users.find((user) => {
    const found_user = (user.username === requesting_user.username) && (user.password === requesting_user.password)

    // username and password don't match
    if (!found_user) return false

    // check if found_user is a dev user who is authenticated against 'all' instances
    if (user.instance_slug === 'all') return true

    // check if found_user is authenticated for the instance
    if (user.instance_slug === instance_slug) return true
  })

  if (auth_instance_user) delete auth_instance_user.password

  return auth_instance_user || false
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
  _authenticate_user,
  formatUserPermissions
}