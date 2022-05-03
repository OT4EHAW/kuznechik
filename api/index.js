import express from "express"

import indexRouter from './routes/index'
import dbConnection from "./db/dbConnection";

import { testingKuznechik } from "./utils/cipher/test";
import { testingHASH } from "./utils/hash/test";
import { testingHMAC } from "./utils/token/signature/test";

const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use('/', indexRouter)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

/*testingHASH()
testingHMAC()
testingKuznechik()*/

dbConnection()

module.exports = app
