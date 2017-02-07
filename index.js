const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send({name: "Hello, World!"})
})

app.listen(3000, () => {
  console.log('[DOUMA API] Listening on port 3000')
})