const Greeting = require('../models/Greeting');
const path = require('path');

// @desc    Get all greetings (sorted newest first)
// @route   GET /api/greetings
// @access  Public
exports.getGreetings = async (req, res, next) => {
  try {
    const greetings = await Greeting.find();
    res.status(200).json({
      success: true,
      count: greetings.length,
      data: greetings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest greeting
// @route   GET /api/greetings/latest
// @access  Public
exports.getLatestGreeting = async (req, res, next) => {
  try {
    const greeting = await Greeting.findOneLatest();
    res.status(200).json({
      success: true,
      data: greeting || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single greeting
// @route   GET /api/greetings/:id
// @access  Public
exports.getGreeting = async (req, res, next) => {
  try {
    const greeting = await Greeting.findById(req.params.id);
    if (!greeting) {
      return res.status(404).json({ success: false, error: 'Greeting not found' });
    }
    res.status(200).json({ success: true, data: greeting });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new greeting
// @route   POST /api/greetings
// @access  Private (dashboard)
exports.createGreeting = async (req, res, next) => {
  try {
    const { nama, jabatan, kataSambutan } = req.body || {};

    if (!nama || !jabatan || !kataSambutan) {
      return res.status(400).json({
        success: false,
        error: 'nama, jabatan, dan kataSambutan wajib diisi',
      });
    }

    const payload = { nama, jabatan, kataSambutan };

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

    const created = await Greeting.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
};

// @desc    Update greeting
// @route   PUT /api/greetings/:id
// @access  Private (dashboard)
exports.updateGreeting = async (req, res, next) => {
  try {
    const greeting = await Greeting.findById(req.params.id);
    if (!greeting) {
      return res.status(404).json({ success: false, error: 'Greeting not found' });
    }

    const updateData = req.body || {};

    if (req.file) {
      const relativePath = path
        .relative(
          path.join(__dirname, '../public/uploads'),
          req.file.path
        )
        .replace(/\\/g, '/');
      updateData.foto = relativePath;
    }

    const updated = await Greeting.findByIdAndUpdate(req.params.id, updateData);

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete greeting
// @route   DELETE /api/greetings/:id
// @access  Private (dashboard)
exports.deleteGreeting = async (req, res, next) => {
  try {
    const greeting = await Greeting.findById(req.params.id);
    if (!greeting) {
      return res.status(404).json({ success: false, error: 'Greeting not found' });
    }

    await Greeting.deleteOneById(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

