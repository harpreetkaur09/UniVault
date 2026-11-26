const crypto = require("crypto");
const sharp = require("sharp");
const config = require("../config/env");
const Media = require("../models/Media");

sharp.cache(false);
sharp.concurrency(1);

const SIZES = {
  project: { width: 1600, height: 1200, quality: 82 },
  profile: { width: 800, height: 800, quality: 85 },
};

const isMediaId = (id) => /^[a-f0-9]{24}$/i.test(id);

const mediaIdFromUrl = (url) => {
  const match = String(url || "").match(
    /^(?:https?:\/\/[^/]+)?\/api\/media\/([a-f0-9]{24})\/?$/i
  );
  return match ? match[1] : null;
};

const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getUsage = async () => {
  const [row] = await Media.aggregate([
    { $group: { _id: null, totalBytes: { $sum: "$size" }, count: { $sum: 1 } } },
  ]);

  const totalBytes = row?.totalBytes || 0;
  const limitBytes = config.mediaStorageLimitMb * 1024 * 1024;

  return {
    count: row?.count || 0,
    totalBytes,
    limitBytes,
    usedPercent: Math.min(100, (totalBytes / limitBytes) * 100),
  };
};

const saveImage = async (buffer, { purpose = "project", originalName = "" } = {}) => {
  const size = SIZES[purpose];
  let result;

  try {
    result = await sharp(buffer, { limitInputPixels: 60000000 })
      .rotate()
      .resize({ width: size.width, height: size.height, fit: "inside", withoutEnlargement: true })
      .webp({ quality: size.quality })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw createError(400, "Could not read this image. Please upload a valid JPEG, PNG or WebP file.");
  }

  const { data, info } = result;
  const usage = await getUsage();

  if (usage.totalBytes + data.length > usage.limitBytes) {
    throw createError(507, "Image storage is full. Delete unused images first.");
  }

  const image = await Media.create({
    data,
    size: data.length,
    width: info.width,
    height: info.height,
    hash: crypto.createHash("sha1").update(data).digest("hex"),
    purpose,
    originalName: String(originalName).slice(0, 255),
  });

  return `/api/media/${image._id}`;
};

const deleteImage = async (url) => {
  const id = mediaIdFromUrl(url);
  if (!id) return;

  try {
    await Media.deleteOne({ _id: id });
  } catch (error) {
    console.warn(`Could not delete image ${id}: ${error.message}`);
  }
};

module.exports = { isMediaId, mediaIdFromUrl, getUsage, saveImage, deleteImage };
