const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "saved"],
      default: "saved",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    favorite: {  
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
