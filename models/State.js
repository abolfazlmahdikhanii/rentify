import mongoose from "mongoose";

const schema = new mongoose.Schema({
  sourceId: {
    type: String,
    unique: true,
  },

  title: {
    type: String,
    required: true,
  },
});

export default mongoose.models.State || mongoose.model("State", schema);
