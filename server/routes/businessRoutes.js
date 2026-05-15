const express = require("express");

const router = express.Router();

const {
  createBusiness,
  getBusinesses,
} = require("../controllers/businessController");

const {
  protect,
} = require("../middleware/authMiddleware");


// CREATE BUSINESS

router.post(
  "/",
  protect,
  createBusiness
);


// GET BUSINESSES

router.get(
  "/",
  getBusinesses
);

module.exports = router;