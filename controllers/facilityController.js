const Facility = require('../models/Facility');
const path = require('path');

exports.getFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.find();

    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities
    });
  } catch (error) {
    next(error);
  }
};

exports.getFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        error: 'Facility not found'
      });
    }

    res.status(200).json({
      success: true,
      data: facility
    });
  } catch (error) {
    next(error);
  }
};

exports.createFacility = async (req, res, next) => {
  try {
    let facility = req.body;

    if (req.file) {
      const relativePath = path
        .relative(
          path.join(__dirname, '../public/uploads'),
          req.file.path
        )
        .replace(/\\/g, '/');
      facility.foto = relativePath;
    }

    const newFacility = await Facility.create(facility);

    res.status(201).json({
      success: true,
      data: newFacility,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateFacility = async (req, res, next) => {
  try {
    let facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        error: 'Facility not found',
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
      updateData.foto = relativePath;
    }

    facility = await Facility.findByIdAndUpdate(req.params.id, updateData);

    res.status(200).json({
      success: true,
      data: facility,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFacility = async (req, res, next) => {
  try {
    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        error: 'Facility not found'
      });
    }

    await Facility.deleteOneById(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
