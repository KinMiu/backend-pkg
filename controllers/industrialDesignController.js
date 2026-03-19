const IndustrialDesign = require('../models/IndustrialDesign');

// @desc    Get all industrial designs
// @route   GET /api/industrial-designs
// @access  Public
exports.getIndustrialDesigns = async (req, res, next) => {
  try {
    const designs = await IndustrialDesign.find();
    
    res.status(200).json({
      success: true,
      count: designs.length,
      data: designs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single industrial design
// @route   GET /api/industrial-designs/:id
// @access  Public
exports.getIndustrialDesign = async (req, res, next) => {
  try {
    const design = await IndustrialDesign.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Industrial Design not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: design
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new industrial design
// @route   POST /api/industrial-designs
// @access  Private
exports.createIndustrialDesign = async (req, res, next) => {
  try {
    const design = await IndustrialDesign.create(req.body);
    
    res.status(201).json({
      success: true,
      data: design
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update industrial design
// @route   PUT /api/industrial-designs/:id
// @access  Private
exports.updateIndustrialDesign = async (req, res, next) => {
  try {
    let design = await IndustrialDesign.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Industrial Design not found'
      });
    }
    
    design = await IndustrialDesign.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    
    res.status(200).json({
      success: true,
      data: design
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete industrial design
// @route   DELETE /api/industrial-designs/:id
// @access  Private
exports.deleteIndustrialDesign = async (req, res, next) => {
  try {
    const design = await IndustrialDesign.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Industrial Design not found'
      });
    }
    
    await IndustrialDesign.deleteOneById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};