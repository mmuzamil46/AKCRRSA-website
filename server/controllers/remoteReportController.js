const OnTimeReg = require('../models/OnTimeReg');

// @desc    Create a new remote report (OnTimeReg)
// @route   POST /api/ontime-reg
// @access  Public (or protected if you add auth)
const createRemoteReport = async (req, res) => {
  try {
    const { serviceName, referenceNumber, gender, woreda, hospitalName, courtName, date } = req.body;

    // Basic Validation
    if (!serviceName || !referenceNumber || !gender || !woreda) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for duplicates
    const existingReport = await OnTimeReg.findOne({ 
      referenceNumber, 
      woreda,
      serviceName 
    });

    if (existingReport) {
      return res.status(400).json({ message: 'Report with this Reference Number already exists!' });
    }

    const newReport = new OnTimeReg({
      serviceName,
      referenceNumber,
      gender,
      woreda,
      hospitalName,
      courtName,
      date: date || new Date()
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Error creating remote report:', error);
    res.status(500).json({ message: 'Server error while creating remote report' });
  }
};

// @desc    Cleanup duplicates
// @route   POST /api/ontime-reg/cleanup
// @access  Public (should be protected)
const cleanupDuplicates = async (req, res) => {
  try {
     console.log('Starting duplicate cleanup on Remote/Atlas...');
     const duplicates = await OnTimeReg.aggregate([
        {
            $group: {
                _id: { referenceNumber: "$referenceNumber", woreda: "$woreda", serviceName: "$serviceName" },
                uniqueIds: { $addToSet: "$_id" },
                count: { $sum: 1 }
            }
        },
        {
            $match: {
                count: { $gt: 1 }
            }
        }
    ]);

    let deletedCount = 0;
    for (const doc of duplicates) {
        const idsToDelete = doc.uniqueIds.slice(1); // Keep the first one
        if (idsToDelete.length > 0) {
            await OnTimeReg.deleteMany({ _id: { $in: idsToDelete } });
            deletedCount += idsToDelete.length;
        }
    }
    
    res.json({ success: true, message: `Cleaned up ${deletedCount} duplicate records.` });

  } catch (error) {
      console.error('Cleanup error:', error);
      res.status(500).json({ message: 'Cleanup failed' });
  }
};

// @desc    Get stats for officer dashboard
// @route   GET /api/ontime-reg/stats
// @access  Public (should use auth)
const getOfficerStats = async (req, res) => {
  try {
    const { woreda, hospitalName } = req.query;

    if (!woreda) {
      return res.status(400).json({ message: 'Woreda is required' });
    }

    let query = { woreda };
    if (hospitalName && hospitalName !== 'undefined' && hospitalName !== 'null') {
        // If officer is assigned to a hospital, only show hospital records?
        // Or show all woreda records? Usually hospital officers see their hospital only.
        query.hospitalName = hospitalName;
    }

    const total = await OnTimeReg.countDocuments(query);
    
    // Breakdown by Service
    const byService = await OnTimeReg.aggregate([
      { $match: query },
      { $group: { _id: "$serviceName", count: { $sum: 1 } } }
    ]);

    // Breakdown by Gender
    const byGender = await OnTimeReg.aggregate([
      { $match: query },
      { $group: { _id: "$gender", count: { $sum: 1 } } }
    ]);

    // Today's total
    const today = new Date();
    today.setHours(0,0,0,0);
    const todayQuery = { ...query, date: { $gte: today } };
    const todayCount = await OnTimeReg.countDocuments(todayQuery);

    // Recent 5 entries
    const recent = await OnTimeReg.find(query).sort({ createdAt: -1 }).limit(5);

    const formatStats = (agg) => {
      const map = {};
      agg.forEach(item => map[item._id] = item.count);
      return map;
    };

    res.json({
      total,
      today: todayCount,
      byService: formatStats(byService),
      byGender: formatStats(byGender),
      recent
    });

  } catch (error) {
    console.error('Error fetching officer stats:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};

module.exports = { createRemoteReport, cleanupDuplicates, getOfficerStats };
