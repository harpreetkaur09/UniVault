const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    role: { type: String, default: "", trim: true },
    greeting: { type: String, default: "", trim: true },
    tagline: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    profileImageUrl: { type: String, default: "", trim: true },
    bio: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
