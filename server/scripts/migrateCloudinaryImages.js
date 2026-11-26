const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Project = require("../models/Project");
const Settings = require("../models/Settings");
const { saveImage } = require("../utils/imageStore");

const dryRun = process.argv.includes("--dry-run");
const cloudinaryUrl = /^https?:\/\/res\.cloudinary\.com\//i;

const download = async (url) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
};

const fileName = (url) => decodeURIComponent(url.split("/").pop().split("?")[0]);

const run = async () => {
  await connectDB();

  let migrated = 0;
  let failed = 0;

  const projects = await Project.find({ "image.url": cloudinaryUrl });
  console.log(`Projects with Cloudinary images: ${projects.length}`);

  for (const project of projects) {
    const oldUrl = project.image.url;

    if (dryRun) {
      console.log(`  ${project.title}: ${oldUrl}`);
      continue;
    }

    try {
      const url = await saveImage(await download(oldUrl), {
        purpose: "project",
        originalName: fileName(oldUrl),
      });
      await Project.updateOne({ _id: project._id }, { $set: { "image.url": url } });
      migrated++;
      console.log(`  done: ${project.title} -> ${url}`);
    } catch (error) {
      failed++;
      console.warn(`  failed: ${project.title} (${error.message})`);
    }
  }

  const settings = await Settings.findOne({ profileImageUrl: cloudinaryUrl });

  if (settings && dryRun) {
    console.log(`  profile photo: ${settings.profileImageUrl}`);
  } else if (settings) {
    try {
      const oldUrl = settings.profileImageUrl;
      const url = await saveImage(await download(oldUrl), {
        purpose: "profile",
        originalName: fileName(oldUrl),
      });
      await Settings.updateOne({ _id: settings._id }, { $set: { profileImageUrl: url } });
      migrated++;
      console.log(`  done: profile photo -> ${url}`);
    } catch (error) {
      failed++;
      console.warn(`  failed: profile photo (${error.message})`);
    }
  }

  console.log(dryRun ? "Dry run, nothing was changed." : `Migrated: ${migrated}, failed: ${failed}`);
};

run()
  .catch((error) => {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
