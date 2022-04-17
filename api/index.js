import express from "express"

import indexRouter from './routes/index'
import dbConnection from "./db/dbConnection";

const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  next()
})
app.use('/', indexRouter)

dbConnection()

module.exports = app
