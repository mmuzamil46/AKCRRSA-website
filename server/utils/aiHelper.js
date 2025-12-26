const { GoogleGenerativeAI } = require("@google/generative-ai");

// Utility to get Gemini instance
const getGenAI = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing from .env");
    }
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const getEmbedding = async (text) => {
    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error("Embedding generation failed:", error);
        throw error;
    }
};

const getChatResponse = async (query, context) => {
    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const prompt = `
You are the official Virtual Assistant for the Addis Ketama Subcity Civil Registration and Residency Service Agency (AKCRRSA) in Addis Ababa, Ethiopia.

PROMPT OBJECTIVE:
Answer user queries accurately using the provided CONTEXT. This context includes office locations (Woredas), latest news, and specific service requirements.

CONTEXT DATA:
${context}

USER QUERY: ${query}

INSTRUCTIONS:
1. CUSTOMER SERVICE TONE: Be professional, polite, and helpful.
2. LANGUAGE: Respond in the SAME LANGUAGE as the user (Amharic or English).
3. WOREDA LOOKUP: If the user asks for a location or manager, refer to the "WOREDA OFFICES" section.
4. NEWS UPDATES: If asked about what's new, refer to the "LATEST NEWS UPDATES" section.
5. SERVICE REQUIREMENTS: If specific service info is provided, give the exact requirements listed.
6. NO HALLUCINATION: If the information is NOT in the context, say you don't have that specific detail and suggest they visit the main office or contact us at +251112590992.
7. CONCISE: Keep answers direct and easy to read. Use bullet points for requirements.

RESPONSE:
`;
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Chat response generation failed:", error);
        throw error;
    }
};

// Helper for Cosine Similarity (local search)
const cosineSimilarity = (vecA, vecB) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

module.exports = { getEmbedding, getChatResponse, cosineSimilarity };
