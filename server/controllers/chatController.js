const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');

// In-memory cache for services
let cachedServices = null;

// Function to clear cache (called from serviceController)
const clearChatCache = () => {
    cachedServices = null;
};

// Amharic Normalization Helper
const normalizeAmharic = (text) => {
    if (!text) return "";
    return text
        .replace(/[ሐኀኃሐኅ]/g, 'ሀ')
        .replace(/[ሠ]/g, 'ሰ')
        .replace(/[ዐ]/g, 'አ')
        .replace(/[ፀ]/g, 'ጸ')
        .replace(/[ቆቁቂቃቄቅቆ]/g, 'ከ') // Optional: soft match K/Q for typos
        .toLowerCase()
        .trim();
};

// @desc    Handle chat messages
// @route   POST /api/chat
// @access  Public
const handleChatMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Please provide a message" });
    }

    // 1. Greeting Intent Detection
    const greetings = ['ሰላም', 'ጤና ይስጥልኝ', 'hi', 'hello', 'hey'];
    const lowerMsg = message.toLowerCase().trim();
    if (greetings.some(g => lowerMsg === g || lowerMsg.startsWith(g + ' '))) {
        return res.json({ text: "ሰላም! የአገልግሎት ረዳት ነኝ። እንዴት ልርዳዎት? ስለ አገልግሎቶች ወይም ስለ አስፈላጊ መስፈርቶች ሊጠይቁኝ ይችላሉ።" });
    }

    // 2. Fetch Services (with Caching)
    if (!cachedServices) {
        cachedServices = await Service.find();
    }
    const services = cachedServices;
    const query = normalizeAmharic(message);

    let bestMatch = null;
    let highestScore = 0;

    services.forEach(service => {
        const title = normalizeAmharic(service.title);
        const description = normalizeAmharic(service.description);
        
        // Match base service
        let baseScore = 0;
        if (query.includes(title) || title.includes(query)) baseScore += 10;

        // If service has sub-categories, check them
        if (service.hasCategories && service.categories) {
            service.categories.forEach(cat => {
                let catScore = baseScore;
                const catName = normalizeAmharic(cat.name);
                const catReqs = cat.requirements.map(r => normalizeAmharic(r)).join(' ');

                // Boost for exact category name match
                if (query.includes(catName)) catScore += 15;

                // Word-by-word fuzzy match
                const queryWords = query.split(/\s+/).filter(w => w.length > 2);
                queryWords.forEach(word => {
                    if (catName.includes(word)) catScore += 5;
                    if (catReqs.includes(word)) catScore += 2;
                    if (title.includes(word)) catScore += 3;
                });

                if (catScore > highestScore) {
                    highestScore = catScore;
                    bestMatch = { 
                        ...service._doc, 
                        isCategory: true, 
                        matchedCat: cat 
                    };
                }
            });
        } else {
            // Simple Service Matching
            let score = baseScore;
            const requirements = service.requirements.map(r => normalizeAmharic(r)).join(' ');
            
            const queryWords = query.split(/\s+/).filter(w => w.length > 2);
            queryWords.forEach(word => {
                if (title.includes(word)) score += 5;
                if (description.includes(word)) score += 2;
                if (requirements.includes(word)) score += 2;
            });

            if (score > highestScore) {
                highestScore = score;
                bestMatch = service;
            }
        }
    });

    let response = "";

    // 3. Smart Response Generation
    if (bestMatch && highestScore > 5) { // Score threshold to avoid bad matches
        if (bestMatch.isCategory) {
            const cat = bestMatch.matchedCat;
            response = `ስለ **${bestMatch.title} (${cat.name})** መረጃ የሚከተለው ነው፡\n\n${bestMatch.description}\n\n**ለ${cat.name} የሚያስፈልጉ መስፈርቶች:**\n${cat.requirements.map(req => `• ${req}`).join('\n')}`;
        } else {
            response = `ስለ **${bestMatch.title}** መረጃ የሚከተለው ነው፡\n\n${bestMatch.description}\n\n**መስፈርቶች (Requirements):**\n${bestMatch.requirements.map(req => `• ${req}`).join('\n')}`;
        }
    } else {
        // Fallback with context
        const suggestions = services.slice(0, 3).map(s => s.title).join('፣ ');
        response = `ይቅርታ፣ ጥያቄዎን በደንብ አልተረዳሁትም። እባክዎ እንደገና በትክክል ይጠይቁ ወይም ከእነዚህ አገልግሎቶች መካከል አንዱን ይጠቀሱ፡ ${suggestions}`;
    }

    res.json({ text: response });
});

module.exports = {
    handleChatMessage,
    clearChatCache
};
