const asyncHandler = require('express-async-handler');
const AboutContent = require('../models/AboutContent');

// @desc    Get about content
// @route   GET /api/about
// @access  Public
const getAboutContent = asyncHandler(async (req, res) => {
    let content = await AboutContent.findOne();
    
    // If no content exists, create default
    if (!content) {
        content = await AboutContent.create({
            mainContent: 'የአዲስ ከተማ ክፍለ ከተማ የሲቪል ምዝገባ እና የነዋሪነት አገልግሎት ጽ/ቤት በአዲስ አበባ ከተማ አስተዳደር ስር የሚገኝ ተቋም ነው።',
            vision: 'በ2022 ዓ.ም የመረጃ አያያዝ እና አጠቃቀም ስርዓት ዘመናዊ፣ ቀልጣፋ እና ተደራሽ ሆኖ ማየት።',
            mission: 'የነዋሪዎችን የሲቪል ክስተቶች (ልደት፣ ጋብቻ፣ ፍቺ፣ ሞት እና ጉዲፈቻ) በትክክል እና በጥራት መመዝገብ።'
        });
    }
    
    res.json(content);
});

// @desc    Update about content
// @route   PUT /api/about
// @access  Private/Admin
const updateAboutContent = asyncHandler(async (req, res) => {
    let content = await AboutContent.findOne();
    
    if (!content) {
        content = await AboutContent.create(req.body);
    } else {
        content.title = req.body.title || content.title;
        content.subtitle = req.body.subtitle || content.subtitle;
        content.heroImage = req.body.heroImage || content.heroImage;
        content.mainContent = req.body.mainContent || content.mainContent;
        content.vision = req.body.vision || content.vision;
        content.mission = req.body.mission || content.mission;
        content.updatedAt = Date.now();
        
        await content.save();
    }
    
    res.json(content);
});

module.exports = {
    getAboutContent,
    updateAboutContent
};
