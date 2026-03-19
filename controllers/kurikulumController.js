const Kurikulum = require('../models/Kurikulum');

exports.getKurikulums = async (req, res, next) => {
  try {
    const kurikulums = await Kurikulum.find();

    res.status(200).json({
      success: true,
      count: kurikulums.length,
      data: kurikulums
    });
  } catch (error) {
    next(error);
  }
};

exports.getKurikulum = async (req, res, next) => {
  try {
    const kurikulum = await Kurikulum.findById(req.params.id);

    if (!kurikulum) {
      return res.status(404).json({
        success: false,
        error: 'Kurikulum not found'
      });
    }

    res.status(200).json({
      success: true,
      data: kurikulum
    });
  } catch (error) {
    next(error);
  }
};

exports.createKurikulum = async (req, res, next) => {
  try {
    const kurikulum = await Kurikulum.create(req.body);

    res.status(201).json({
      success: true,
      data: kurikulum
    });
  } catch (error) {
    next(error);
  }
};

exports.updateKurikulum = async (req, res, next) => {
  try {
    let kurikulum = await Kurikulum.findById(req.params.id);

    if (!kurikulum) {
      return res.status(404).json({
        success: false,
        error: 'Kurikulum not found'
      });
    }

    kurikulum = await Kurikulum.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: kurikulum
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteKurikulum = async (req, res, next) => {
  try {
    const kurikulum = await Kurikulum.findById(req.params.id);

    if (!kurikulum) {
      return res.status(404).json({
        success: false,
        error: 'Kurikulum not found'
      });
    }

    await Kurikulum.deleteOneById(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
