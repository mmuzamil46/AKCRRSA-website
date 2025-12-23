const pdf = require('pdf-parse');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const KnowledgeChunk = require('../models/KnowledgeChunk');
const { getEmbedding } = require('./aiHelper');

const extractTextFromPDF = async (buffer) => {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error("PDF parsing failed:", error);
        throw error;
    }
};

const chunkText = (text, size = 1500, overlap = 300) => {
    if (!text) return [];
    
    // Basic sentence-aware chunking
    const sentences = text.split(/[.!?]\s/);
    const chunks = [];
    let currentChunk = "";

    for (const sentence of sentences) {
        if ((currentChunk.length + sentence.length) < size) {
            currentChunk += (sentence + " ");
        } else {
            if (currentChunk.trim()) chunks.push(currentChunk.trim());
            currentChunk = sentence + " ";
        }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());
    return chunks;
};

const indexDocument = async (document) => {
    try {
        console.log(`Starting indexing for document: ${document.title}`);
        let buffer;
        if (document.fileUrl.startsWith('http')) {
            const response = await axios.get(document.fileUrl, { responseType: 'arraybuffer' });
            buffer = Buffer.from(response.data);
        } else {
            const filePath = path.join(__dirname, '..', document.fileUrl);
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found at path: ${filePath}`);
            }
            buffer = fs.readFileSync(filePath);
        }

        const fullText = await extractTextFromPDF(buffer);
        const chunks = chunkText(fullText);

        console.log(`Extracted ${chunks.length} chunks from document.`);

        // Clear existing chunks for this document
        await KnowledgeChunk.deleteMany({ document: document._id });

        for (let i = 0; i < chunks.length; i++) {
            const textChunk = chunks[i];
            if (textChunk.length < 50) continue; 
            
            const embedding = await getEmbedding(textChunk);
            await KnowledgeChunk.create({
                text: textChunk,
                embedding,
                document: document._id,
                metadata: {
                    sourceTitle: document.title,
                    category: document.category,
                    chunkIndex: i
                }
            });
        }

        document.isIndexed = true;
        await document.save();
        console.log(`Successfully indexed document: ${document.title}`);
    } catch (error) {
        console.error(`Failed to index document ${document.title}:`, error);
        // Don't throw, just log for background task
    }
};

module.exports = { indexDocument };
