const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  description: {
    type: String,
  },
  entryFrom: {
    type: Number,
    required: true,
  },
  entryTo: {
    type: Number,
    required: true,
  },
  stopLoss: {
    type: Number,
    required: true,
  },
  takeProfits: [
    {
      type: Number,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("posts", PostSchema);
