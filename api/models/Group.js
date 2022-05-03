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
    user_id: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  })

module.exports =
  mongoose.models.Group || mongoose.model('Group', groupSchema);
