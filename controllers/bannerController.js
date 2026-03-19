const Banner = require('../models/Banner');
const path = require('path');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
exports.getBanners = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.active === 'true') filter.isActive = true;
    if (req.query.active === 'false') filter.isActive = false;

    const banners = await Banner.find(filter);

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single banner
// @route   GET /api/banners/:id
// @access  Public
exports.getBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found',
      });
    }

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new banner
// @route   POST /api/banners
// @access  Private
exports.createBanner = async (req, res, next) => {
  try {
    const banner = { ...req.body };

    // Normalisasi nilai boolean yang dikirim sebagai string dari FormData
    if (banner.isActive !== undefined) {
      banner.isActive =
        banner.isActive === true ||
        banner.isActive === 'true' ||
        banner.isActive === '1';
    }
    if (banner.hideHeroText !== undefined) {
      banner.hideHeroText =
        banner.hideHeroText === true ||
        banner.hideHeroText === 'true' ||
        banner.hideHeroText === '1';
    }

    if (req.file) {
      const relativePath = path
        .relative(
          path.join(__dirname, '../public/uploads'),
          req.file.path
        )
        .replace(/\\/g, '/');
      banner.foto = relativePath;
    }

    if (!banner.foto) {
      return res.status(400).json({
        success: false,
        error: 'Foto banner wajib diisi',
      });
    }

    const newBanner = await Banner.create(banner);

    res.status(201).json({
      success: true,
      data: newBanner,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private
exports.updateBanner = async (req, res, next) => {
  try {
    let banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found',
      });
    }

    const updateData = { ...req.body };

    // Normalisasi boolean dari string FormData
    if (updateData.isActive !== undefined) {
      updateData.isActive =
        updateData.isActive === true ||
        updateData.isActive === 'true' ||
        updateData.isActive === '1';
    }
    if (updateData.hideHeroText !== undefined) {
      updateData.hideHeroText =
        updateData.hideHeroText === true ||
        updateData.hideHeroText === 'true' ||
        updateData.hideHeroText === '1';
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

    banner = await Banner.findByIdAndUpdate(req.params.id, updateData);

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private
exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found',
      });
    }

    await Banner.deleteOneById(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

