const express = require('express')
const dotenv = require('dotenv')
const GtfsRealtimeBindings = require('gtfs-realtime-bindings')
const mtaEndpoints = require('./endpoints.json')

const app = express()
const hostname = '127.0.0.1'
const port = 3000

dotenv.config()

app.get('/', ((req, res) => {
  res.sendFile('index.html', {root: __dirname})
}))

app.get('/:id', ( async (req, res) => {
  const line = req.params['id']
  const endpointEntry = mtaEndpoints.endpointsMap.find((entry) => entry.lines.includes(line.toUpperCase()))
  if(!endpointEntry) console.error("No endpoint found for given train line")
  await fetch(`${mtaEndpoints.url}${endpointEntry.urlSuffix}`, {
    method: 'GET',
    headers: {
      'x-api-key': process.env.API_KEY,
      'Content-Type': 'application/json',
    }
  })
    .then(async (response) => {
      const buffer = await response.arrayBuffer();
      const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
        new Uint8Array(buffer)
      )
      return feed.entity.map((entity) => {
        if(entity.tripUpdate) {
          return {
            route: entity.tripUpdate.trip.routeId
          }
        }
      })
    })
    .then((data) => res.send(data))
    .catch((error) => console.log(error))
}))

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})
