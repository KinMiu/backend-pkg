const Achievement = require('../models/Achievement');
const path = require('path');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
exports.getAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find();
    
    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Public
exports.getAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new achievement
// @route   POST /api/achievements
// @access  Private
exports.createAchievement = async (req, res, next) => {
  try {
    let achievement = req.body;
    
    // Normalize mahasiswa to always be an array
    if (achievement.mahasiswa) {
      if (Array.isArray(achievement.mahasiswa)) {
        // ok
      } else {
        achievement.mahasiswa = [achievement.mahasiswa];
      }
    }
    
    if (req.file) {
      const relativePath = path
        .relative(
          path.join(__dirname, '../public/uploads'),
          req.file.path
        )
        .replace(/\\/g, '/');
      achievement.foto = relativePath;
    }
    
    // Create achievement
    const newAchievement = await Achievement.create(achievement);
    
    res.status(201).json({
      success: true,
      data: newAchievement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private
exports.updateAchievement = async (req, res, next) => {
  try {
    let achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }
    
    let updateData = req.body;
    
    if (updateData.mahasiswa) {
      if (Array.isArray(updateData.mahasiswa)) {
        // ok
      } else {
        updateData.mahasiswa = [updateData.mahasiswa];
      }
    }
    
    if (req.file) {
      const relativePath = path
        .relative(
          path.join(__dirname, '../public/uploads'),
          req.file.path
        )
        .replace(/\\/g, '/');
      updateData.foto = relativePath;
    }
    
    // Update achievement
    achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      updateData
    );
    
    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private
exports.deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }
    
    await Achievement.deleteOneById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};