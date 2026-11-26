const mongoose = require("mongoose");
const { mediaMongoUri, mediaDbName } = require("../config/env");

const connection = mediaMongoUri
  ? mongoose.createConnection(mediaMongoUri, { dbName: mediaDbName })
  : mongoose.connection.useDb(mediaDbName, { useCache: true });

connection.on("error", (err) => console.error("Media DB error:", err.message));

const mediaSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true, select: false },
    contentType: { type: String, default: "image/webp" },
    size: { type: Number, required: true },
    width: Number,
    height: Number,
    hash: { type: String, required: true },
    purpose: { type: String, enum: ["project", "profile"], default: "project" },
    originalName: { type: String, maxlength: 255, default: "" },
  },
  { timestamps: true, collection: "media" }
);

module.exports = connection.model("Media", mediaSchema);
