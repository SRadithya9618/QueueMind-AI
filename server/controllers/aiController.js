const axios = require("axios");

const getPrediction = async (req, res) => {

  try {

    const { businessName, queueCount, avgWait, time, completedQueues } = req.body;

    const prompt = `
    Business: ${businessName || "Your Business"}
    Current Queue Count: ${queueCount || 0}
    Average Wait Time: ${avgWait || 5} mins
    Current Time: ${time || new Date().toLocaleTimeString()}
    Completed Queues Today: ${completedQueues || 0}

    Give:
    - Rush prediction
    - Estimated waiting time
    - Best visiting time
    - Recommendation
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    const text =
      response.data.candidates[0].content.parts[0].text;

    res.json({
      success: true,
      prediction: text,
    });

  } catch (error) {

    console.log(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message:
  error.response?.data?.error?.message ||
  "AI prediction failed"
    });

  }
};

module.exports = {
  getPrediction,
};