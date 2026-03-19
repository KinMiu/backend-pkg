const Pengumuman = require('../models/Pengumuman');
const path = require('path');

exports.getPengumuman = async (req, res, next) => {
  try {
    const list = await Pengumuman.find();
    res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPengumumanById = async (req, res, next) => {
  try {
    const item = await Pengumuman.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Pengumuman not found',
      });
    }
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

exports.createPengumuman = async (req, res, next) => {
  try {
    let data = req.body;
    if (req.file) {
      const relativePath = path
        .relative(
          path.join(__dirname, '../public/uploads'),
          req.file.path
        )
        .replace(/\\/g, '/');
      data.foto = relativePath;
    }
    const newItem = await Pengumuman.create(data);
    res.status(201).json({
      success: true,
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePengumuman = async (req, res, next) => {
  try {
    const existing = await Pengumuman.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Pengumuman not found',
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
    const updated = await Pengumuman.findByIdAndUpdate(req.params.id, updateData);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePengumuman = async (req, res, next) => {
  try {
    const existing = await Pengumuman.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Pengumuman not found',
      });
    }
    await Pengumuman.deleteOneById(req.params.id);
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
