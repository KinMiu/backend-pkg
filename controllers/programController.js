const Program = require('../models/Program');

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
exports.getPrograms = async (req, res, next) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (active === 'true') filter.isActive = true;
    if (active === 'false') filter.isActive = false;

    const programs = await Program.find(filter);

    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single program
// @route   GET /api/programs/:id
// @access  Public
exports.getProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found',
      });
    }

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new program
// @route   POST /api/programs
// @access  Private (belum ada auth middleware di project ini)
exports.createProgram = async (req, res, next) => {
  try {
    const created = await Program.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
};

// @desc    Update program
// @route   PUT /api/programs/:id
// @access  Private (belum ada auth middleware di project ini)
exports.updateProgram = async (req, res, next) => {
  try {
    const existing = await Program.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Program not found',
      });
    }

    const updated = await Program.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete program
// @route   DELETE /api/programs/:id
// @access  Private (belum ada auth middleware di project ini)
exports.deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Program not found',
      });
    }

    await Program.deleteOneById(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

