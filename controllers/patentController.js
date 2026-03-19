const Patent = require('../models/Patent');

// @desc    Get all patents
// @route   GET /api/patents
// @access  Public
exports.getPatents = async (req, res, next) => {
  try {
    const patents = await Patent.find();
    
    res.status(200).json({
      success: true,
      count: patents.length,
      data: patents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single patent
// @route   GET /api/patents/:id
// @access  Public
exports.getPatent = async (req, res, next) => {
  try {
    const patent = await Patent.findById(req.params.id);
    
    if (!patent) {
      return res.status(404).json({
        success: false,
        error: 'Patent not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new patent
// @route   POST /api/patents
// @access  Private
exports.createPatent = async (req, res, next) => {
  try {
    const patent = await Patent.create(req.body);
    
    res.status(201).json({
      success: true,
      data: patent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patent
// @route   PUT /api/patents/:id
// @access  Private
exports.updatePatent = async (req, res, next) => {
  try {
    let patent = await Patent.findById(req.params.id);
    
    if (!patent) {
      return res.status(404).json({
        success: false,
        error: 'Patent not found'
      });
    }
    
    patent = await Patent.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    
    res.status(200).json({
      success: true,
      data: patent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete patent
// @route   DELETE /api/patents/:id
// @access  Private
exports.deletePatent = async (req, res, next) => {
  try {
    const patent = await Patent.findById(req.params.id);
    
    if (!patent) {
      return res.status(404).json({
        success: false,
        error: 'Patent not found'
      });
    }
    
    await Patent.deleteOneById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};