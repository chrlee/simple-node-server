const express = require('express')
const app = express()

const hostname = '127.0.0.1'
const port = 3000

app.get('/', ((req, res) => {
  res.sendFile('index.html', {root: __dirname})
}))

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})
