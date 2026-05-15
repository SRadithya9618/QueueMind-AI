const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generateQueuePrediction = async (
  businessName,
  queueCount,
  averageServiceTime
) => {
  const prompt = `
You are an AI queue prediction assistant.

Business Name: ${businessName}
Current Queue Count: ${queueCount}
Average Service Time: ${averageServiceTime} minutes

Analyze:
1. Current crowd level
2. Estimated waiting difficulty
3. Best visiting time suggestion
4. Queue management insights

Keep response short and professional.
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

module.exports = {
  generateQueuePrediction,
};