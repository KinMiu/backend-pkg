const Partner = require('../models/Partner');
const path = require('path');

// @desc    Get all partners
// @route   GET /api/partners
// @access  Public
exports.getPartners = async (req, res, next) => {
  try {
    const partners = await Partner.find();
    
    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single partner
// @route   GET /api/partners/:id
// @access  Public
exports.getPartner = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        error: 'Partner not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new partner
// @route   POST /api/partners
// @access  Private
exports.createPartner = async (req, res, next) => {
  try {
    let partner = req.body;

    if (req.file) {
      const relativePath = path
        .relative(
          path.join(__dirname, '../public/uploads'),
          req.file.path
        )
        .replace(/\\/g, '/');
      partner.logo = relativePath;
    }

    const newPartner = await Partner.create(partner);
    
    res.status(201).json({
      success: true,
      data: newPartner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update partner
// @route   PUT /api/partners/:id
// @access  Private
exports.updatePartner = async (req, res, next) => {
  try {
    let partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        error: 'Partner not found'
      });
    }
    
    let updateData = req.body;

    if (req.file) {
      const relativePath = path
        .relative(
          path.join(__dirname, '../public/uploads'),
          req.file.path
        )
        .replace(/\\/g, '/');
      updateData.logo = relativePath;
    }

    partner = await Partner.findByIdAndUpdate(
      req.params.id,
      updateData
    );
    
    res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete partner
// @route   DELETE /api/partners/:id
// @access  Private
exports.deletePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        error: 'Partner not found'
      });
    }
    
    await Partner.deleteOneById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};