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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `
You are an official assistant for the Addis Ketama Subcity Civil Registration and Residency Service (AKCRRSA). 
Your task is to answer user queries accurately based ONLY on the provided context from our official rules and regulations.

If the answer is not in the context, politely inform the user that you don't have that specific information and suggest they contact the office directly. 
Context Header: [Rules and Regulations]
Context:
${context}

User Query: ${query}

Important Instructions:
1. Always respond in the same language as the user (Amharic or English).
2. Keep your response concise, professional, and helpful.
3. If the context is in Amharic, translate the relevant parts to answer the user's question if they ask in English, and vice versa.

Response:
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
