const Settings = require("../models/Settings");
const { saveImage, deleteImage } = require("../utils/imageStore");

const getSettings = async (_req, res, next) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

const ALLOWED_FIELDS = [
  "name",
  "role",
  "greeting",
  "tagline",
  "location",
  "email",
  "bio",
];

const updateSettings = async (req, res, next) => {
  try {
    const updates = {};

    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(updates);
    } else {
      Object.assign(settings, updates);
      await settings.save();
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }

    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    const oldImageUrl = settings.profileImageUrl;

    const url = await saveImage(req.file.buffer, {
      purpose: "profile",
      originalName: req.file.originalname,
    });

    settings.profileImageUrl = url;

    try {
      await settings.save();
    } catch (error) {
      await deleteImage(url);
      throw error;
    }

    await deleteImage(oldImageUrl);

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

const deleteProfileImage = async (_req, res, next) => {
  try {
    const settings = await Settings.findOne();

    if (!settings || !settings.profileImageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "No profile image to remove" });
    }

    const oldImageUrl = settings.profileImageUrl;

    settings.profileImageUrl = "";
    await settings.save();

    await deleteImage(oldImageUrl);

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  uploadProfileImage,
  deleteProfileImage,
};
