import express from 'express'
import { getinfo, start, stop } from './aternos'

const app = express()

app.set('port', process.env.PORT || 3000)

app.get('/api/info', async (req, res) => {
  try {
    const { id } = req.query
    const results = await getinfo(id as string)
    res.json(results)
  } catch (e) {
    console.log(e)
    return res.json(e)
  }
})

app.get('/api/start', async (req, res) => {
  try {
    const { id } = req.query
    const results = await start(id as string, 4100)
    res.json(results)
  } catch (error) {
    console.log(error)
    return res.json(error)
  }
})

app.get('/api/stop', async (req, res) => {
  try {
    const { id } = req.query
    const results = await stop(id as string, 3100)
    res.json(results)
  } catch (error) {
    console.log(error)
    return res.json(error)
  }
})

app.listen(app.get('port'), () => {
  console.log('|/|/|/|/|/| ATERNOS API REST - V0.1 |/|/|/|/|/|')
  console.log(`|| Server on: ${process.env.SERVER_HOST}:${app.get('port')}`)
})