const Structural = require('../models/Structural');
const path = require('path');

// @desc    Get all structurals (sorted by order then createdAt)
// @route   GET /api/structurals
// @access  Public
exports.getStructurals = async (req, res, next) => {
  try {
    const structurals = await Structural.find();
    res.status(200).json({
      success: true,
      count: structurals.length,
      data: structurals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single structural
// @route   GET /api/structurals/:id
// @access  Public
exports.getStructural = async (req, res, next) => {
  try {
    const structural = await Structural.findById(req.params.id);
    if (!structural) {
      return res.status(404).json({
        success: false,
        error: 'Structural data not found',
      });
    }

    res.status(200).json({
      success: true,
      data: structural,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new structural
// @route   POST /api/structurals
// @access  Private (dashboard)
exports.createStructural = async (req, res, next) => {
  try {
    const { nama, jabatan, order } = req.body || {};

    if (!nama || !jabatan) {
      return res.status(400).json({
        success: false,
        error: 'nama dan jabatan wajib diisi',
      });
    }

    const payload = {
      nama,
      jabatan,
      order: typeof order === 'number' ? order : Number(order) || 0,
    };

    if (req.file) {
      const relativePath = path
        .relative(
          path.join(__dirname, '../public/uploads'),
          req.file.path
        )
        .replace(/\\/g, '/');
      payload.foto = relativePath;
    }

    if (!payload.foto) {
      return res.status(400).json({
        success: false,
        error: 'Foto wajib diisi',
      });
    }

    const created = await Structural.create(payload);

    res.status(201).json({
      success: true,
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update structural
// @route   PUT /api/structurals/:id
// @access  Private (dashboard)
exports.updateStructural = async (req, res, next) => {
  try {
    const structural = await Structural.findById(req.params.id);
    if (!structural) {
      return res.status(404).json({
        success: false,
        error: 'Structural data not found',
      });
    }

    const updateData = req.body || {};
    if (typeof updateData.order !== 'undefined') {
      updateData.order = Number(updateData.order) || 0;
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

    const updated = await Structural.findByIdAndUpdate(req.params.id, updateData);

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete structural
// @route   DELETE /api/structurals/:id
// @access  Private (dashboard)
exports.deleteStructural = async (req, res, next) => {
  try {
    const structural = await Structural.findById(req.params.id);
    if (!structural) {
      return res.status(404).json({
        success: false,
        error: 'Structural data not found',
      });
    }

    await Structural.deleteOneById(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

