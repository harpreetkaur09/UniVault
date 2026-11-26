const express = require("express");
const {
  getSettings,
  updateSettings,
  uploadProfileImage,
  deleteProfileImage,
} = require("../controllers/settingsController");
const { protect, adminOnly } = require("../middlewares/auth");
const { uploadLimiter } = require("../middlewares/rateLimiter");
const { uploadSingle, handleMulterError } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getSettings);
router.put("/", protect, adminOnly, updateSettings);

router.post(
  "/profile-image",
  protect,
  adminOnly,
  uploadLimiter,
  uploadSingle,
  handleMulterError,
  uploadProfileImage
);
router.delete("/profile-image", protect, adminOnly, deleteProfileImage);

module.exports = router;
