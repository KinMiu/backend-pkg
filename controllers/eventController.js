const Event = require('../models/Event');
const path = require('path');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res, next) => {
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

    // Create event
    const newEvent = await Event.create(event);
    
    res.status(201).json({
      success: true,
      data: newEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
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

    // Update event
    event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData
    );
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    await Event.deleteOneById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};