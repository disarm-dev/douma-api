const User = require('../lib/auth')

module.exports = {
  login: function (req, res) {
    const cred = req.body
    if (cred.username && cred.password) {
      const user = User.findByUsernamePassword(cred.username, cred.password)
      if (user) {
        res.status(200).send({
          _id: user._id,
          name: user.name,
          username: user.username,
          key: user.key,
          instance_slug: user.instance_slug,
          permissions: user.permissions,
          allowed_apps: user.allowed_apps,
        })
      } else {
        res.status(401).send({message: 'User with this login or password is not found.'})
      }
    } else {
      res.status(401).send({message: 'Need both login and password fields.'})
    }
  }
}
