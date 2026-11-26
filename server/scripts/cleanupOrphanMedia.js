const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Project = require("../models/Project");
const Settings = require("../models/Settings");
const Media = require("../models/Media");
const { mediaIdFromUrl } = require("../utils/imageStore");

const apply = process.argv.includes("--apply");
const oneHourAgo = Date.now() - 60 * 60 * 1000;

const run = async () => {
  await connectDB();

  const projects = await Project.find().select("image");
  const settings = await Settings.findOne().select("profileImageUrl");

  const usedIds = new Set(
    [...projects.map((p) => p.image?.url), settings?.profileImageUrl]
      .map(mediaIdFromUrl)
      .filter(Boolean)
  );

  const images = await Media.find().select("size createdAt originalName purpose");
  const unused = images.filter(
    (img) => !usedIds.has(img._id.toString()) && img.createdAt.getTime() < oneHourAgo
  );
  const bytes = unused.reduce((sum, img) => sum + img.size, 0);

  console.log(`Stored: ${images.length}, in use: ${usedIds.size}, unused: ${unused.length}`);
  unused.forEach((img) =>
    console.log(`  ${img._id} ${img.purpose} ${Math.round(img.size / 1024)} KB ${img.originalName}`)
  );

  if (unused.length === 0) return;

  if (!apply) {
    console.log(`Run again with --apply to delete them (frees ${(bytes / 1024 / 1024).toFixed(2)} MB).`);
    return;
  }

  await Media.deleteMany({ _id: { $in: unused.map((img) => img._id) } });
  console.log(`Deleted ${unused.length} images.`);
};

run()
  .catch((error) => {
    console.error("Cleanup failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
