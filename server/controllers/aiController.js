const Business = require("../models/Business");
const QueueEntry = require("../models/QueueEntry");
const { generateBusinessInsights } = require("../services/geminiService");

/**
 * @desc    Get AI insights for a specific business with real data
 * @route   POST /api/ai/predict
 * @access  Private
 * @body    { businessId }
 * 
 * Fetches real business data from MongoDB and generates dynamic AI insights
 * with business-type-specific predictions.
 */
const getPrediction = async (req, res) => {
  try {
    const { businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({ success: false, message: "Business ID is required" });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: "Business not found" });
    }

    const currentQueueCount = await QueueEntry.countDocuments({ business: businessId, status: "waiting" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedQueueCount = await QueueEntry.countDocuments({
      business: businessId,
      status: "completed",
      createdAt: { $gte: today },
    });

    const completedQueues = await QueueEntry.find({
      business: businessId,
      status: "completed",
      createdAt: { $gte: today },
    });

    let averageWaitTime = 0;
    if (completedQueues.length > 0) {
      const totalWaitTime = completedQueues.reduce((sum, queue) => {
        const waitTime = (queue.updatedAt - queue.createdAt) / (1000 * 60);
        return sum + waitTime;
      }, 0);
      averageWaitTime = Math.round(totalWaitTime / completedQueues.length);
    } else {
      averageWaitTime = business.avgServiceTime || 5;
    }

    const currentTime = new Date().toISOString();

    const businessDataForAI = {
      businessName: business.name,
      businessType: business.type,
      currentQueueCount,
      completedQueueCount,
      averageWaitTime,
      currentTime,
    };

    let aiPrediction;
    try {
      aiPrediction = await generateBusinessInsights(businessDataForAI);
    } catch (aiError) {
      console.error("Gemini API Error:", aiError.message);
      aiPrediction = generateFallbackResponse(business.type, currentQueueCount);
    }

    return res.status(200).json({
      success: true,
      prediction: aiPrediction,
      metadata: {
        businessName: business.name,
        businessType: business.type,
        currentQueueCount,
        completedQueueCount,
        averageWaitTime,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate AI prediction", error: error.message });
  }
};

/**
 * Fallback response when Gemini API is unavailable
 * Provides generic but useful insights based on business type
 */
const generateFallbackResponse = (businessType, queueCount) => {
  const fallbackMessages = {
    restaurant: "Queue manageable. Visit 2-5 PM.",
    hospital: "Standard flow. Visit 10-11 AM.",
    salon: "Moderate load. Book in advance.",
    default: "Queue active. Visit non-peak hours.",
  };
  return fallbackMessages[businessType.toLowerCase()] || fallbackMessages.default;
};

module.exports = { getPrediction };