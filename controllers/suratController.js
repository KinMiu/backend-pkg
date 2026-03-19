const path = require('path');
const Surat = require('../models/Surat');

exports.getAllSurat = async (req, res, next) => {
  try {
    const list = await Surat.find();
    res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSuratById = async (req, res, next) => {
  try {
    const surat = await Surat.findById(req.params.id);
    if (!surat) {
      return res.status(404).json({
        success: false,
        error: 'Surat not found',
      });
    }
    res.status(200).json({
      success: true,
      data: surat,
    });
  } catch (error) {
    next(error);
  }
};

exports.createSurat = async (req, res, next) => {
  try {
    const { judul, tanggal } = req.body;

    if (!judul) {
      return res.status(400).json({
        success: false,
        error: 'Judul surat is required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'PDF file is required',
      });
    }

    const relativePath = path
      .relative(path.join(__dirname, '../public/uploads'), req.file.path)
      .replace(/\\/g, '/');

    const surat = await Surat.create({
      judul,
      tanggal,
      pdfFile: relativePath,
    });

    res.status(201).json({
      success: true,
      data: surat,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSurat = async (req, res, next) => {
  try {
    const existing = await Surat.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Surat not found',
      });
    }

    const updateData = {
      judul: req.body.judul,
      tanggal: req.body.tanggal,
    };

    if (req.file) {
      const relativePath = path
        .relative(path.join(__dirname, '../public/uploads'), req.file.path)
        .replace(/\\/g, '/');
      updateData.pdfFile = relativePath;
    }

    const updated = await Surat.findByIdAndUpdate(req.params.id, updateData);

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSurat = async (req, res, next) => {
  try {
    const existing = await Surat.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Surat not found',
      });
    }

    await Surat.deleteOneById(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

