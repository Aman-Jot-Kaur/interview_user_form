const { Schema, model } = require("mongoose");
const { randomUUID } = require("crypto");
const user_schema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      default: randomUUID,
    },
      name: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    date: { type: Date, required: true },

    image1: { type: String, required: true }, // image path or URL
    image2: { type: String, required: true },
    video: { type: String, required: true },

    deleted_at: { type: Date, default: null }, // soft delete
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
      },
    },
  }
);





module.exports = model("users", user_schema);