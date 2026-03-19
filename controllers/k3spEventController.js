const K3spEvent = require('../models/K3spEvent');
const path = require('path');

// @desc    Get all K3SP events
// @route   GET /api/k3sp-events
// @access  Public
exports.getK3spEvents = async (req, res, next) => {
  try {
    const events = await K3spEvent.find();
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single K3SP event
// @route   GET /api/k3sp-events/:id
// @access  Public
exports.getK3spEvent = async (req, res, next) => {
  try {
    const event = await K3spEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new K3SP event
// @route   POST /api/k3sp-events
// @access  Private
exports.createK3spEvent = async (req, res, next) => {
  try {
    let event = req.body;

    if (Array.isArray(req.files) && req.files.length > 0) {
      const relativePaths = req.files.map((f) =>
        path
          .relative(path.join(__dirname, '../public/uploads'), f.path)
          .replace(/\\/g, '/')
      );
      event.fotos = relativePaths;
      event.foto = relativePaths[0] || event.foto || '';
    }

    const newEvent = await K3spEvent.create(event);
    res.status(201).json({
      success: true,
      data: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update K3SP event
// @route   PUT /api/k3sp-events/:id
// @access  Private
exports.updateK3spEvent = async (req, res, next) => {
  try {
    let event = await K3spEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    let updateData = req.body;

    if (Array.isArray(req.files) && req.files.length > 0) {
      const relativePaths = req.files.map((f) =>
        path
          .relative(path.join(__dirname, '../public/uploads'), f.path)
          .replace(/\\/g, '/')
      );
      updateData.fotos = relativePaths;
      updateData.foto = relativePaths[0] || updateData.foto || '';
    }

    event = await K3spEvent.findByIdAndUpdate(req.params.id, updateData);
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete K3SP event
// @route   DELETE /api/k3sp-events/:id
// @access  Private
exports.deleteK3spEvent = async (req, res, next) => {
  try {
    const event = await K3spEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }
    await K3spEvent.deleteOneById(req.params.id);
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

