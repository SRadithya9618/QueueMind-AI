const express = require("express");
const router = express.Router();
const {
  bookQueue,
  getUserQueues,
  getBusinessQueue,
  updateQueueStatus,
} = require("../controllers/queueController");
const { protect } = require("../middleware/authMiddleware");

router.post("/book", protect, bookQueue);
router.get("/user", protect, getUserQueues);
router.get("/business", protect, getBusinessQueue);
router.put("/:id/status", protect, updateQueueStatus);

module.exports = router;