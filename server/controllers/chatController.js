const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');

// @desc    Handle chat messages
// @route   POST /api/chat
// @access  Public
const handleChatMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Please provide a message" });
    }

    const services = await Service.find();
    const query = message.toLowerCase().trim();

    // Simple matching logic
    // We search for matches in Title, Description, and Requirements
    let bestMatch = null;
    let highestScore = 0;

    services.forEach(service => {
        let score = 0;
        const title = service.title.toLowerCase();
        const description = service.description.toLowerCase();
        
        // Base matching on Service Title
        if (query.includes(title) || title.includes(query)) score += 10;

        // Matching within Categories if they exist
        if (service.hasCategories && service.categories) {
            service.categories.forEach(cat => {
                let catScore = score; // Start with base service score
                const catName = cat.name.toLowerCase();
                const catReqs = cat.requirements.map(r => r.toLowerCase()).join(' ');

                if (query.includes(catName)) catScore += 15; // High boost for category name match

                const words = query.split(/\s+/).filter(w => w.length > 2);
                words.forEach(word => {
                    if (catName.includes(word)) catScore += 5;
                    if (catReqs.includes(word)) catScore += 2;
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
            const requirements = service.requirements.map(r => r.toLowerCase()).join(' ');
            
            const words = query.split(/\s+/).filter(w => w.length > 2);
            words.forEach(word => {
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

    if (bestMatch && highestScore > 0) {
        if (bestMatch.isCategory) {
            const cat = bestMatch.matchedCat;
            response = `ስለ **${bestMatch.title} (${cat.name})** መረጃ የሚከተለው ነው፡\n\n${bestMatch.description}\n\n**ለ${cat.name} የሚያስፈልጉ መስፈርቶች:**\n${cat.requirements.map(req => `• ${req}`).join('\n')}`;
        } else {
            response = `ስለ **${bestMatch.title}** መረጃ የሚከተለው ነው፡\n\n${bestMatch.description}\n\n**መስፈርቶች (Requirements):**\n${bestMatch.requirements.map(req => `• ${req}`).join('\n')}`;
        }
    } else {
        // Suggested services if no match found
        const suggestions = services.slice(0, 3).map(s => s.title).join('፣ ');
        response = `ይቅርታ፣ የጠየቁትን አገልግሎት ማግኘት አልቻልኩም። እነዚህን አገልግሎቶች መሞከር ይችላሉ፡ ${suggestions}`;
    }

    res.json({ text: response });
});

module.exports = {
    handleChatMessage
};
