import express from 'express'
import cors from 'cors'
import * as functions from 'firebase-functions'
import { pubRouter } from './pub'
import { getContainer } from '../utils/sdk'
import { env } from '../utils/config'
import { prvRouter } from './prv'

const rest = express()

rest.use((req, _res, next) => {
  console.info(`REQUEST: ${req.method} ${req.originalUrl}`)
  if (Object.keys(req.body).length !== 0) {
    console.info(`BODY: ${JSON.stringify(req.body, null, 2)}`)
  }
  next()
})

rest.use(
  cors({
    origin: (origin, callback) => {
      const whitelist = env.cors.whitelist.split(',')

      if ((origin && whitelist?.indexOf(origin) !== -1) || !origin) {
        callback(null, true)
      } else {
        console.error('CORS blocked ', origin)
        callback(new Error(`Origin: ${origin}: Not allowed by CORS`))
      }
    },
    optionsSuccessStatus: 200,
    // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
)

rest.use((req, res, next) => {
  req.response = {
    success: (message = 'success.') => {
      res.status(200).json({ message })
      return
    },
    error: (message = 'FATAL: Something went wrong.') => {
      res.status(400).json({ message })
      return
    },
    unauthorized: () => {
      res.status(401).json({ message: 'Unauthorized.' })
      return
    },
    badRequest: () => {
      res.status(400).json({ message: 'Bad Request.' })
      return
    },
    json: (data: unknown) => {
      res.status(200).json(data)
      return
    },
  }
  next()
})

rest.use(async (req, _res, next) => {
  try {
    // Initialize container
    req.container = await getContainer()

    next()
  } catch (error) {
    console.log(error)
    req.response.error((error as Error).message)
  }
})

rest.use('/pub', pubRouter)
rest.use('/prv', prvRouter)

export const api = functions.https.onRequest(rest)
