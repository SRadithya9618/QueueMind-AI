const express = require("express");

const router = express.Router();

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.get(
  "/dashboard",
  protect,
  authorizeRoles("owner"),
  (req, res) => {
    res.json({
      message: "Welcome Owner Dashboard",
      user: req.user,
    });
  }
);

module.exports = router;