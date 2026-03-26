const { GoogleGenerativeAI } = require("@google/generative-ai");

const analyzeVitals = async (vitals) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Analyze the following medical vitals and provide a short, professional assessment:
        Temperature: ${vitals.temperature}
        Blood Pressure: ${vitals.bloodPressure}
        Pulse Rate: ${vitals.pulseRate}
        Weight: ${vitals.weight}
        Height: ${vitals.height}
        SPO2: ${vitals.spo2}

        Focus on identifying abnormalities like High BP, Low BP, or Fever. Keep the response concise and helpful.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return "Vitals analysis unavailable at the moment.";
    }
};

module.exports = { analyzeVitals };
