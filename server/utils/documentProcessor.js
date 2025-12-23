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
        console.log(`[Indexing] Starting for: ${document.title}`);
        let buffer;

        if (document.fileUrl.startsWith('http')) {
            console.log(`[Indexing] Fetching remote file: ${document.fileUrl}`);
            // Use a clean axios config to avoid any global default headers
            const response = await axios({
                method: 'get',
                url: document.fileUrl,
                responseType: 'arraybuffer',
                transformRequest: [(data, headers) => {
                    // Remove common authorization headers that might cause 401 on external sites
                    delete headers.common['Authorization'];
                    delete headers.common['authorization'];
                    return data;
                }]
            });
            buffer = Buffer.from(response.data);
            console.log(`[Indexing] Remote file fetched successfully. Size: ${buffer.length} bytes`);
        } else if (document.fileUrl.startsWith('data:')) {
            console.log(`[Indexing] Processing Data URI (Base64)`);
            const base64Data = document.fileUrl.split(';base64,').pop();
            buffer = Buffer.from(base64Data, 'base64');
            console.log(`[Indexing] Data URI processed successfully. Size: ${buffer.length} bytes`);
        } else {
            console.log(`[Indexing] Reading local file: ${document.fileUrl}`);
            const filePath = path.join(__dirname, '..', document.fileUrl);
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found at path: ${filePath}`);
            }
            buffer = fs.readFileSync(filePath);
            console.log(`[Indexing] Local file read successfully. Size: ${buffer.length} bytes`);
        }

        const fullText = await extractTextFromPDF(buffer);
        const chunks = chunkText(fullText);

        console.log(`[Indexing] Extracted ${chunks.length} chunks.`);

        // Clear existing chunks for this document
        await KnowledgeChunk.deleteMany({ document: document._id });

        for (let i = 0; i < chunks.length; i++) {
            const textChunk = chunks[i];
            if (textChunk.length < 50) continue; 
            
            try {
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
            } catch (embedError) {
                console.error(`[Indexing] Embedding failed for chunk ${i}:`, embedError.message);
                throw embedError; // Re-throw to catch in outer block
            }
        }

        document.isIndexed = true;
        await document.save();
        console.log(`[Indexing] SUCCESS: ${document.title}`);
    } catch (error) {
        console.error(`[Indexing] FAILED for ${document.title}:`, error.message);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, error.response.data);
        }
    }
};

module.exports = { indexDocument };
