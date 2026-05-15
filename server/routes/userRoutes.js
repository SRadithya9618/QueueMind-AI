const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected profile route",
    user: req.user,
  });
});

module.exports = router;