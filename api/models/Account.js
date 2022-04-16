const {Schema, model} = require('mongoose')

const AccountSchema = new Schema({
    _id: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    gost_hash_512: {
      type: String,
      required: true
    },
  },
  {
    _id: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  })

module.exports = model('account', AccountSchema)
