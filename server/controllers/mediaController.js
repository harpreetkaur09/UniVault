const Media = require("../models/Media");
const { isMediaId, getUsage } = require("../utils/imageStore");

const serveMedia = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isMediaId(id)) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    const info = await Media.findById(id).select("hash contentType");

    if (!info) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    res.set({
      "Content-Type": info.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: `"${info.hash}"`,
      "Cross-Origin-Resource-Policy": "cross-origin",
    });

    if (req.fresh) return res.status(304).end();

    const image = await Media.findById(id).select("+data");

    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    res.send(image.data);
  } catch (error) {
    next(error);
  }
};

const getMediaUsage = async (req, res, next) => {
  try {
    res.json({ success: true, data: await getUsage() });
  } catch (error) {
    next(error);
  }
};

module.exports = { serveMedia, getMediaUsage };
