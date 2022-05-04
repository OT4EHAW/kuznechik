import mongoose from "mongoose"

const recordSchema = new mongoose.Schema({
  group_id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  login_encrypted: {
    type: String,
    required: true
  },
  password_encrypted: {
    type: String,
    required: true
  },
    encrypted_fields_gost_hash_512: {
    type: String,
    required: true
  }
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

module.exports =
  mongoose.models.Record || mongoose.model('Record', recordSchema);
