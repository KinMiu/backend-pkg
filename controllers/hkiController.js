const Hki = require('../models/Hki');

// @desc    Get all HKIs
// @route   GET /api/hki
// @access  Public
exports.getHkis = async (req, res, next) => {
  try {
    const hkis = await Hki.find();
    
    res.status(200).json({
      success: true,
      count: hkis.length,
      data: hkis
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single HKI
// @route   GET /api/hki/:id
// @access  Public
exports.getHki = async (req, res, next) => {
  try {
    const hki = await Hki.findById(req.params.id);
    
    if (!hki) {
      return res.status(404).json({
        success: false,
        error: 'HKI not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: hki
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new HKI
// @route   POST /api/hki
// @access  Private
exports.createHki = async (req, res, next) => {
  try {
    const hki = await Hki.create(req.body);
    
    res.status(201).json({
      success: true,
      data: hki
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update HKI
// @route   PUT /api/hki/:id
// @access  Private
exports.updateHki = async (req, res, next) => {
  try {
    let hki = await Hki.findById(req.params.id);
    
    if (!hki) {
      return res.status(404).json({
        success: false,
        error: 'HKI not found'
      });
    }
    
    hki = await Hki.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    
    res.status(200).json({
      success: true,
      data: hki
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete HKI
// @route   DELETE /api/hki/:id
// @access  Private
exports.deleteHki = async (req, res, next) => {
  try {
    const hki = await Hki.findById(req.params.id);
    
    if (!hki) {
      return res.status(404).json({
        success: false,
        error: 'HKI not found'
      });
    }
    
    await Hki.deleteOneById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};