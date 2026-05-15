const QueueEntry = require("../models/QueueEntry");
const Business = require("../models/Business");
const { createNotification } = require("./notificationController");

// @desc    Book a new queue token
// @route   POST /api/queue/book
// @access  Private (Customer)
const bookQueue = async (req, res) => {
  const { businessId } = req.body;
  const userId = req.user._id;

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Check if user already has an active token for this business
    const activeToken = await QueueEntry.findOne({
      customer: userId,
      business: businessId,
      status: { $in: ["waiting", "called"] },
    });

    if (activeToken) {
      return res.status(400).json({ message: "You already have an active token for this business" });
    }

    // Get current token number for this business today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tokenCount = await QueueEntry.countDocuments({
      business: businessId,
      createdAt: { $gte: today },
    });

    const tokenNumber = tokenCount + 1;

    // Calculate position (count of 'waiting' entries)
    const waitingCount = await QueueEntry.countDocuments({
      business: businessId,
      status: "waiting",
    });

    const position = waitingCount + 1;
    const estimatedWait = business.avgServiceTime * waitingCount;

    const queueEntry = await QueueEntry.create({
      customer: userId,
      business: businessId,
      tokenNumber,
      position,
      estimatedWait,
    });

    // Emit socket event
    const io = req.app.get("io");
    io.to(businessId.toString()).emit("queueBooked", queueEntry);

    // Notification for Owner
    if (business) {
      await createNotification(
        io,
        business.owner,
        "New Booking",
        `Token #${tokenNumber} booked by ${req.user.name}`,
        "success"
      );
    }

    res.status(201).json({
      message: "Token booked successfully",
      queueEntry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's queue history
// @route   GET /api/queue/user
// @access  Private (Customer)
const getUserQueues = async (req, res) => {
  try {
    const queues = await QueueEntry.find({ customer: req.user._id })
      .populate("business", "name type address")
      .sort("-createdAt");

    res.json(queues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get owner's live queue
// @route   GET /api/queue/business
// @access  Private (Owner)
const getBusinessQueue = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(404).json({ message: "Business not found for this owner" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const queues = await QueueEntry.find({
      business: business._id,
      createdAt: { $gte: today },
    })
      .populate("customer", "name email")
      .sort("tokenNumber");

    res.json(queues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update queue status
// @route   PUT /api/queue/:id/status
// @access  Private (Owner)
const updateQueueStatus = async (req, res) => {
  const { status } = req.body;
  const queueId = req.params.id;

  try {
    const queueEntry = await QueueEntry.findById(queueId);
    if (!queueEntry) {
      return res.status(404).json({ message: "Queue entry not found" });
    }

    queueEntry.status = status;

    // If status is completed or cancelled, we might want to update positions of others?
    // For simplicity, we'll just update this one.
    // Real position calculation usually happens dynamically on GET.
    
    await queueEntry.save();

    // Emit socket event
    const io = req.app.get("io");
    io.to(queueEntry.business.toString()).emit("queueUpdated", queueEntry);

    // Notification for Customer
    let notifTitle = "";
    let notifMsg = "";
    let notifType = "info";

    if (status === 'called') {
      notifTitle = "It's your turn!";
      notifMsg = `Token #${queueEntry.tokenNumber} is now being called. Please proceed.`;
      notifType = "success";
    } else if (status === 'completed') {
      notifTitle = "Visit Completed";
      notifMsg = "Thank you for using QueueMind AI. Hope you had a great experience!";
    } else if (status === 'cancelled') {
      notifTitle = "Token Cancelled";
      notifMsg = `Your token #${queueEntry.tokenNumber} has been cancelled by the owner.`;
      notifType = "warning";
    }

    if (notifTitle) {
      await createNotification(io, queueEntry.customer, notifTitle, notifMsg, notifType);
    }

    res.json({ message: `Status updated to ${status}`, queueEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookQueue,
  getUserQueues,
  getBusinessQueue,
  updateQueueStatus,
};