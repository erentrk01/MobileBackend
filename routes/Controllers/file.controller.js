const express = require("express");
const router = express.Router();
const Event = require("../../models/Event");
const { upload } = require("../../middlewares/upload.middleware");


router.post("/events/:eventId/upload", upload.array("files"), async (req, res) => {
  const { eventId } = req.params;
  const files = req.files;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const fileData = files.map((file) => {
      return {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: file.path,
      };
    });

    event.files.push(...fileData);
    await event.save();

    res.status(201).json({ message: "Files uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
