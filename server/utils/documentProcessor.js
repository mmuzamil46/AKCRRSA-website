const pdf = require('pdf-parse');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const KnowledgeChunk = require('../models/KnowledgeChunk');
const { getEmbedding } = require('./aiHelper');

const extractTextFromPDF = async (buffer) => {
    try {
        // Handle potential ESM vs CommonJS variations in different environments
        let parsePdf = pdf;
        if (typeof parsePdf !== 'function' && parsePdf.default) {
            parsePdf = parsePdf.default;
        }
        
        if (typeof parsePdf !== 'function') {
            console.error("[Indexing] pdf-parse detection failed. Keys:", Object.keys(pdf));
            // Just try calling it if it's the only way, or throw better error
            throw new Error(`pdf-parse library error: expected function, got ${typeof parsePdf}`);
        }

        const data = await parsePdf(buffer);
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

        const url = (document.fileUrl || '').trim();

        if (url.startsWith('http')) {
            console.log(`[Indexing] Fetching remote file: ${url}`);
            // Use a fresh axios instance to avoid any global interceptors/headers
            const cleanAxios = axios.create();
            const response = await cleanAxios.get(url, {
                responseType: 'arraybuffer'
            });
            buffer = Buffer.from(response.data);
            console.log(`[Indexing] Remote file fetched successfully. Size: ${buffer.length} bytes`);
        } else if (url.startsWith('data:') || url.includes(';base64,') || url.startsWith('JVBERi')) {
            console.log(`[Indexing] Processing Data URI or Base64 string (starts with: ${url.substring(0, 20)}...)`);
            const base64Data = url.includes(';base64,') ? url.split(';base64,').pop() : url;
            buffer = Buffer.from(base64Data, 'base64');
            console.log(`[Indexing] Base64 processing successful. Size: ${buffer.length} bytes`);
        } else {
            console.log(`[Indexing] Treating as local file path: ${url.substring(0, 50)}${url.length > 50 ? '...' : ''}`);
            const filePath = path.isAbsolute(url) ? url : path.join(__dirname, '..', url);
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
