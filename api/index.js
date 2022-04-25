import express from "express"

import indexRouter from './routes/index'
import dbConnection from "./db/dbConnection";
import { checkHashCode } from "./utils/hashCode";

const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use('/', indexRouter)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  next()
})

checkHashCode()
dbConnection()

module.exports = app
