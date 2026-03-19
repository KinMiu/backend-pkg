const Statistik = require('../models/Statistik');

exports.getStatistik = async (req, res, next) => {
  try {
    const list = await Statistik.find();
    res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

exports.getStatistikById = async (req, res, next) => {
  try {
    const item = await Statistik.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Statistik not found',
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

exports.createStatistik = async (req, res, next) => {
  try {
    const newItem = await Statistik.create(req.body);
    res.status(201).json({
      success: true,
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStatistik = async (req, res, next) => {
  try {
    const existing = await Statistik.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Statistik not found',
      });
    }
    const updated = await Statistik.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteStatistik = async (req, res, next) => {
  try {
    const existing = await Statistik.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Statistik not found',
      });
    }
    await Statistik.deleteOneById(req.params.id);
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
