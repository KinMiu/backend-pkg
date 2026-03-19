const Operator = require('../models/Operator');
const bcrypt = require('bcryptjs');
const XLSX = require('xlsx');

exports.getOperators = async (req, res, next) => {
  try {
    const operators = await Operator.find();

    res.status(200).json({
      success: true,
      count: operators.length,
      data: operators,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOperator = async (req, res, next) => {
  try {
    const operator = await Operator.findById(req.params.id);

    if (!operator) {
      return res.status(404).json({
        success: false,
        error: 'Operator not found',
      });
    }

    res.status(200).json({
      success: true,
      data: operator,
    });
  } catch (error) {
    next(error);
  }
};

const DEFAULT_OPERATOR_PASSWORD = '12345678';

exports.createOperator = async (req, res, next) => {
  try {
    const { satminkal, npsn, email, password, latitude, longitude, linkGoogleMaps } = req.body;

    let password_hash;
    if (password && typeof password === 'string' && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(password, salt);
    } else {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(DEFAULT_OPERATOR_PASSWORD, salt);
    }

    const newOperator = await Operator.create({
      satminkal,
      npsn,
      email: email ? String(email).trim().toLowerCase() : null,
      password_hash,
      latitude: latitude ? String(latitude).trim() : '',
      longitude: longitude ? String(longitude).trim() : '',
      linkGoogleMaps: linkGoogleMaps ? String(linkGoogleMaps).trim() : '',
    });

    res.status(201).json({
      success: true,
      data: newOperator,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOperator = async (req, res, next) => {
  try {
    let operator = await Operator.findById(req.params.id);

    if (!operator) {
      return res.status(404).json({
        success: false,
        error: 'Operator not found',
      });
    }

    const updateData = { ...req.body };
    delete updateData.password_hash;
    if (updateData.password !== undefined) {
      const pwd = updateData.password;
      delete updateData.password;
      if (pwd && typeof pwd === 'string' && pwd.length >= 6) {
        const salt = await bcrypt.genSalt(10);
        updateData.password_hash = await bcrypt.hash(pwd, salt);
      }
    }
    if (updateData.email !== undefined) {
      updateData.email = updateData.email ? String(updateData.email).trim().toLowerCase() : null;
    }

    operator = await Operator.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.status(200).json({
      success: true,
      data: operator,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteOperator = async (req, res, next) => {
  try {
    const operator = await Operator.findById(req.params.id);

    if (!operator) {
      return res.status(404).json({
        success: false,
        error: 'Operator not found',
      });
    }

    await Operator.deleteOneById(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import operators from Excel
// @route   POST /api/operators/import-excel
// @access  Private
exports.importOperatorsFromExcel = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'File Excel wajib diunggah',
    });
  }

  const filePath = req.file.path;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    const results = {
      totalRows: rows.length,
      created: 0,
      skipped: 0,
      errors: [],
    };

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      const satminkal = row['satminkal'] || row['SATMINKAL'] || row['Satminkal'];
      const npsn = row['npsn'] || row['NPSN'] || row['Npsn'];
      const email = row['email'] || row['Email'] || row['EMAIL'];
      const latitude = row['latitude'] || row['Latitude'] || row['LATITUDE'];
      const longitude = row['longitude'] || row['Longitude'] || row['LONGITUDE'];
      const linkGoogleMaps =
        row['linkGoogleMaps'] ||
        row['Link Google Maps'] ||
        row['LINK_GOOGLE_MAPS'] ||
        row['link_google_maps'];

      if (!satminkal || !npsn) {
        results.skipped += 1;
        results.errors.push({
          row: index + 2,
          message: 'SATMINKAL dan NPSN wajib diisi',
        });
        continue;
      }

      try {
        await Operator.create({
          satminkal: String(satminkal).trim(),
          npsn: String(npsn).trim(),
          email: email ? String(email).trim().toLowerCase() : null,
          latitude: latitude ? String(latitude).trim() : '',
          longitude: longitude ? String(longitude).trim() : '',
          linkGoogleMaps: linkGoogleMaps ? String(linkGoogleMaps).trim() : '',
        });
        results.created += 1;
      } catch (err) {
        results.skipped += 1;
        results.errors.push({
          row: index + 2,
          message: err.message || 'Gagal menyimpan data operator',
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download Excel template for operators import
// @route   GET /api/operators/import-template
// @access  Public/Private (no auth implemented)
exports.downloadOperatorsTemplate = (req, res, next) => {
  try {
    const data = [
      ['satminkal', 'npsn', 'email', 'latitude', 'longitude', 'linkGoogleMaps'],
      ['SDN Contoh 01', '12345678', 'operator@contoh.sch.id', '-5.12345', '105.12345', 'https://maps.google.com/...'],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Operator');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="template_import_operator.xlsx"');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    return res.send(buffer);
  } catch (error) {
    next(error);
  }
};

