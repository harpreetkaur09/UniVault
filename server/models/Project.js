const mongoose = require("mongoose");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    studentName: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Student name cannot exceed 100 characters"],
    },
    rollNumber: {
      type: String,
      default: "",
      trim: true,
      maxlength: [30, "Roll number cannot exceed 30 characters"],
    },
    studentEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => !v || EMAIL_REGEX.test(v),
        message: "Student email must be a valid email address",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    tech: {
      type: [{ type: String, trim: true }],
      default: [],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: "At least one technology is required",
      },
    },
    image: {
      url: { type: String, default: "" },
    },
    liveUrl: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: (v) => !v || URL_REGEX.test(v),
        message: "Live URL must be a valid URL format",
      },
    },
    githubUrl: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: (v) => !v || URL_REGEX.test(v),
        message: "GitHub URL must be a valid URL format",
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ["published", "draft"],
        message: "Status must be either published or draft",
      },
      default: "published",
    },
  },
  { timestamps: true }
);

projectSchema.pre("save", async function () {
  if (!this.isModified("title")) return;

  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const existing = await mongoose.model("Project").findOne({
    slug: this.slug,
    _id: { $ne: this._id },
  });

  if (existing) {
    this.slug = `${this.slug}-${Date.now().toString(36)}`;
  }
});

projectSchema.index({ featured: 1, order: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ rollNumber: 1 });
projectSchema.index({ studentEmail: 1 });

module.exports = mongoose.model("Project", projectSchema);
