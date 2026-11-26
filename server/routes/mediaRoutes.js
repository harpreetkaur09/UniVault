const express = require("express");
const { serveMedia, getMediaUsage } = require("../controllers/mediaController");
const { protect, adminOnly } = require("../middlewares/auth");
const { mediaLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.get("/usage", mediaLimiter, protect, adminOnly, getMediaUsage);
router.get("/:id", mediaLimiter, serveMedia);

module.exports = router;
