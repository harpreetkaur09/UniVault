const express = require("express");
const {
  getAllProjects,
  getProjectBySlug,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  deleteProjectImage,
} = require("../controllers/projectController");
const { protect, adminOnly, staffOnly } = require("../middlewares/auth");
const { uploadLimiter } = require("../middlewares/rateLimiter");
const { uploadSingle, handleMulterError } = require("../middlewares/uploadMiddleware");
const { createProjectValidator, updateProjectValidator } = require("../validators/projectValidator");
const validate = require("../middlewares/validate");

const router = express.Router();

router.get("/", getAllProjects);

// /admin/all must be defined before /:slug to avoid "admin" being treated as a slug
router.get("/admin/all", protect, staffOnly, getAdminProjects);
router.get("/:slug", getProjectBySlug);

router.post("/", protect, staffOnly, createProjectValidator, validate, createProject);
router.put("/:id", protect, staffOnly, updateProjectValidator, validate, updateProject);
// Deleting a project is Admin-only; teachers receive 403 Forbidden
router.delete("/:id", protect, adminOnly, deleteProject);

router.post("/:id/image", protect, staffOnly, uploadLimiter, uploadSingle, handleMulterError, uploadProjectImage);
// Removing a project's image is part of editing it, so teachers may do it too
router.delete("/:id/image", protect, staffOnly, deleteProjectImage);

module.exports = router;
