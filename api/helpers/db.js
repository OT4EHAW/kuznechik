const mongoose = require('mongoose')

const DB_USER='master'
const DB_PASSWORD= 'master1234'
const DB_NAME='master-passwords'

const DB_HOST="mongo"
const DB_PORT='27017'


const url = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
const url2 = `mongodb://master:master1234@mongo:27017/master-passwords?authSource=admin`

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
module.exports = () => {
  mongoose.connect(url, options);
  mongoose.connection.on('open', () => {
    console.log('база данных подключена');
  })
  mongoose.connection.on('error', (err) => {
    console.error(`не удалось подключиться к базе данных: ${err}`);
  })
}
