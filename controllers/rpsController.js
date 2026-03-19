const Rps = require('../models/Rps');
const path = require('path');

exports.getAllRps = async (req, res, next) => {
  try {
    const rpsList = await Rps.find();

    res.status(200).json({
      success: true,
      count: rpsList.length,
      data: rpsList
    });
  } catch (error) {
    next(error);
  }
};

exports.getRpsById = async (req, res, next) => {
  try {
    const rps = await Rps.findById(req.params.id);

    if (!rps) {
      return res.status(404).json({
        success: false,
        error: 'RPS not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rps
    });
  } catch (error) {
    next(error);
  }
};

exports.createRps = async (req, res, next) => {
  try {
    const { courseName } = req.body;

    if (!courseName) {
      return res.status(400).json({
        success: false,
        error: 'Course name is required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'PDF file is required',
      });
    }

    const relativePath = path
      .relative(
        path.join(__dirname, '../public/uploads'),
        req.file.path
      )
      .replace(/\\/g, '/');

    const rps = await Rps.create({
      courseName,
      pdfFile: relativePath,
    });

    res.status(201).json({
      success: true,
      data: rps,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateRps = async (req, res, next) => {
  try {
    let rps = await Rps.findById(req.params.id);

    if (!rps) {
      return res.status(404).json({
        success: false,
        error: 'RPS not found',
      });
    }

    const updateData = { courseName: req.body.courseName };

    if (req.file) {
      const relativePath = path
        .relative(
          path.join(__dirname, '../public/uploads'),
          req.file.path
        )
        .replace(/\\/g, '/');
      updateData.pdfFile = relativePath;
    }

    rps = await Rps.findByIdAndUpdate(req.params.id, updateData);

    res.status(200).json({
      success: true,
      data: rps,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteRps = async (req, res, next) => {
  try {
    const rps = await Rps.findById(req.params.id);

    if (!rps) {
      return res.status(404).json({
        success: false,
        error: 'RPS not found'
      });
    }

    await Rps.deleteOneById(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
