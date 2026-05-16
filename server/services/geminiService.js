const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const generateBusinessInsights = async (businessData) => {
  const {
    businessName,
    businessType,
    currentQueueCount,
    completedQueueCount,
    averageWaitTime,
    currentTime,
  } = businessData;

  const dynamicPrompt = `You are an AI queue analyst.

BUSINESS DATA:
- Business Name: ${businessName}
- Business Type: ${businessType}
- Current Queue Count: ${currentQueueCount}
- Completed Services Today: ${completedQueueCount}
- Average Wait Time: ${averageWaitTime} minutes
- Current Time: ${currentTime}

ANALYSIS REQUIRED:
Give a concise dashboard response in 2–4 short lines only. No markdown, no headings, no bullet points. Keep it under 250 characters.`;

  const result = await model.generateContent(dynamicPrompt);
  return result.response.text();
};

module.exports = { generateBusinessInsights };