import mongoose from "mongoose"

const DB_USER = 'master'
const DB_PASSWORD = 'master1234'
/*const DB_HOST_DEV = 'localhost'
const DB_HOST_PROD = 'mongo'*/
const DB_HOST = process.env.MONGO_PATH || "localhost"
const DB_PORT = '27017'
const DB_NAME = 'kuznechik'
const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
export default  () => {
  mongoose.connect(uri, options).then(
    () => console.log('база данных подключена'),
    err => {
      console.warn('url', uri)
      console.error(`ошибка подключения: ${err}`)
    }
  ).catch(()=>{
    console.error(`не удалось подключиться к базе данных`)
  })
}


