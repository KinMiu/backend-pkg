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
    const data = { ...(req.body || {}) };
    delete data._id;
    delete data.id;

    if (Array.isArray(req.files) && req.files.length > 0) {
      const relativePaths = req.files.map((f) =>
        path
          .relative(path.join(__dirname, '../public/uploads'), f.path)
          .replace(/\\/g, '/')
      );
      data.fotos = relativePaths;
      data.foto = relativePaths[0] || data.foto || '';
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
    const updateData = { ...(req.body || {}) };
    delete updateData._id;
    delete updateData.id;

    if (Array.isArray(req.files) && req.files.length > 0) {
      const relativePaths = req.files.map((f) =>
        path
          .relative(path.join(__dirname, '../public/uploads'), f.path)
          .replace(/\\/g, '/')
      );
      updateData.fotos = relativePaths;
      updateData.foto = relativePaths[0] || updateData.foto || '';
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
