import mongoose from "mongoose"

const groupSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    gost_hash_512: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true,
      unique: true
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  })

module.exports =
  mongoose.models.Group || mongoose.model('Group', groupSchema);
