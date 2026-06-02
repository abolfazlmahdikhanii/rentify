import mongoose from "mongoose";

const schema = new mongoose.Schema({
  sourceId: {
    type: String,
    unique: true,
  },

  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    required: true,
    index: true,
  },

  title: {
    type: String,
    required: true,
  },
});

schema.index({
  stateId: 1,
  title: 1,
});

export default mongoose.models.City || mongoose.model("City", schema);
