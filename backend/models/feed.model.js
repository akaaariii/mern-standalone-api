const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }, // end of schema definition
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Feed', feedSchema);