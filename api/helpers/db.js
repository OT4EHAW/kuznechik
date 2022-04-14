const mongoose = require('mongoose')

const DB_USER='master'
const DB_PASSWORD= 'master1234'

const DB_HOST="mongodb"
const DB_PORT='27017'

const DB_NAME='master-passwords'

const url = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin?directConnection=true`

module.exports = () => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
    useFindAndModify: false,
    useCreateIndex: true
  })
  mongoose.connection.on('open', () => {
    console.log('MongoDB : Connected successfully');
  })
  mongoose.connection.on('error', (err) => {
    console.log(`MongoDB ERROR : ${err}`);
  })
}
