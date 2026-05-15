const Business = require("../models/Business");


// CREATE BUSINESS

const createBusiness = async (req, res) => {

  try {

    const {
      name,
      type,
      address,
      avgServiceTime,
      maxQueueSize,
    } = req.body;

    const business = await Business.create({

      owner: req.user._id,

      name,
      type,
      address,
      avgServiceTime,
      maxQueueSize,

    });

    res.status(201).json(business);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// GET ALL BUSINESSES

const getBusinesses = async (req, res) => {

  try {

    const businesses = await Business.find();

    res.json(businesses);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


module.exports = {
  createBusiness,
  getBusinesses,
};