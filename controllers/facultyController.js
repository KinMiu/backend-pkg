const Faculty = require('../models/Faculty');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const Operator = require('../models/Operator');

// @desc    Get all faculties
// @route   GET /api/faculties
// @access  Public
exports.getFaculties = async (req, res, next) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).json({
      success: true,
      count: faculties.length,
      data: faculties
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single faculty
// @route   GET /api/faculties/:id
// @access  Public
exports.getFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        error: 'Faculty not found'
      });
    }
    res.status(200).json({
      success: true,
      data: faculty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new faculty
// @route   POST /api/faculties
// @access  Private
exports.createFaculty = async (req, res, next) => {
  try {
    let faculty = req.body;

    // Parse JSON string fields (arrays/objects)
    faculty = parseJSONFields(faculty);

    if (req.file) {
      const relativePath = path
        .relative(
          path.join(__dirname, '../public/uploads'),
          req.file.path
        )
        .replace(/\\/g, '/');
      faculty.foto = relativePath;
    }

    if (faculty.pengabdian && typeof faculty.pengabdian === 'string') {
      try {
        faculty.pengabdian = JSON.parse(faculty.pengabdian);
      } catch (err) {
        throw new Error('Invalid JSON format for pengabdian');
      }
    }

    await processEmployeeDocumentsForFaculty(faculty);

    const newFaculty = await Faculty.create(faculty);
    res.status(201).json({
      success: true,
      data: newFaculty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update faculty
// @route   PUT /api/faculties/:id
// @access  Private
exports.updateFaculty = async (req, res, next) => {
  try {
    let faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        error: 'Faculty not found'
      });
    }

    let updateData = req.body;

    // Parse JSON string fields (arrays/objects)
    updateData = parseJSONFields(updateData);

    if (req.file) {
      const relativePath = path
        .relative(
          path.join(__dirname, '../public/uploads'),
          req.file.path
        )
        .replace(/\\/g, '/');
      updateData.foto = relativePath;
    }

    if (updateData.pengabdian && typeof updateData.pengabdian === 'string') {
      try {
        updateData.pengabdian = JSON.parse(updateData.pengabdian);
      } catch (err) {
        throw new Error('Invalid JSON format for pengabdian');
      }
    }

    await processEmployeeDocumentsForFaculty(
      updateData,
      faculty && (faculty.name || faculty.nama)
    );

    faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      updateData
    );

    res.status(200).json({
      success: true,
      data: faculty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete faculty
// @route   DELETE /api/faculties/:id
// @access  Private
exports.deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        error: 'Faculty not found'
      });
    }

    await Faculty.deleteOneById(req.params.id);
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set research visibility for all faculties
// @route   PUT /api/faculties/research-visibility
// @access  Private
exports.setResearchVisibilityAll = async (req, res, next) => {
  try {
    const { isResearchPublic } = req.body || {};

    if (typeof isResearchPublic !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isResearchPublic must be a boolean'
      });
    }

    const result = await Faculty.setResearchVisibilityAll(isResearchPublic);

    res.status(200).json({
      success: true,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        isResearchPublic
      }
    });
  } catch (error) {
    next(error);
  }
};

function slugifyName(name) {
  if (!name) return 'unknown';
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown';
}

async function processEmployeeDocumentsForFaculty(data, existingName) {
  if (!data) return;

  const nameForFolder = data.name || data.nama || existingName || 'unknown';
  const slug = slugifyName(nameForFolder);
  const uploadRoot = path.join(__dirname, '../public/uploads');

  const categories = [
    'identitasPegawai',
    'skCpns',
    'skPns',
    'skPppk',
    'riwayatPangkat',
    'riwayatJabatan',
    'riwayatGaji',
    'pendidikanUmum',
    'diklat',
    'suamiIstri',
    'aktaAnak',
    'penilaianPrestasi',
    'penetapanAngkaKredit',
    'dokumenTambahan',
  ];

  for (const category of categories) {
    const docs = data[category];
    if (!Array.isArray(docs)) continue;

    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      if (!doc || !doc.fileData || typeof doc.fileData !== 'string') continue;

      if (!doc.fileData.startsWith('data:')) continue;

      const storedPath = await saveBase64DocumentFile(
        uploadRoot,
        slug,
        category,
        doc.fileData,
        doc.fileType
      );
      docs[i] = {
        ...doc,
        fileData: storedPath,
      };
    }

    data[category] = docs;
  }
}

async function saveBase64DocumentFile(
  uploadRoot,
  slugName,
  category,
  dataUrl,
  fileType
) {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid file data format for employee document');
  }

  const mime = matches[1];
  const base64 = matches[2];

  let ext = '.bin';
  if (mime === 'application/pdf') ext = '.pdf';
  else if (mime === 'image/jpeg') ext = '.jpg';
  else if (mime === 'image/png') ext = '.png';
  else if (mime === 'image/webp') ext = '.webp';

  const categorySafe = String(category || 'misc')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'misc';

  const dir = path.join(uploadRoot, 'faculty', slugName, categorySafe);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filename = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}${ext}`;
  const filePath = path.join(dir, filename);

  const buffer = Buffer.from(base64, 'base64');
  await fs.promises.writeFile(filePath, buffer);

  const relativePath = path
    .relative(uploadRoot, filePath)
    .replace(/\\/g, '/');
  return relativePath;
}

function normalizeGender(value) {
  if (!value) return null;
  const raw = String(value).toLowerCase().replace(/\s|-/g, '');
  if (raw === 'lakilaki' || raw === 'laki' || raw === 'pria') {
    return 'Laki-laki';
  }
  if (raw === 'perempuan' || raw === 'wanita') {
    return 'Perempuan';
  }
  return null;
}

function getCell(obj, keys) {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }
  return null;
}

// @desc    Import faculties from Excel
// @route   POST /api/faculties/import-excel
// @access  Private
exports.importFacultiesFromExcel = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'File Excel wajib diunggah',
    });
  }

  const filePath = req.file.path;
  const mode = (req.query.mode || '').toString();
  const satminkalFromQuery = (req.query.satminkal || '').toString().trim();

  try {
    let operatorSatminkalSet = new Set();
    if (mode !== 'operator') {
      const allOperators = await Operator.find();
      operatorSatminkalSet = new Set(
        allOperators
          .map((op) => (op.satminkal || '').trim().toLowerCase())
          .filter((v) => v)
      );
    }

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

      const name = getCell(row, ['Nama Lengkap', 'nama', 'Nama', 'NAMA']);
      const nuptk = getCell(row, ['NUPTK', 'nuptk', 'Nuptk']);
      const nip = getCell(row, ['NIP', 'nip', 'Nip']);
      const nrg = getCell(row, ['NRG', 'nrg', 'Nrg']);
      let satminkal = getCell(row, ['SATMINKAL', 'Satminkal', 'satminkal']);
      const jenisKelaminRaw = getCell(row, ['Jenis Kelamin', 'jenis_kelamin', 'jenisKelamin']);

      if (!name || !nuptk) {
        results.skipped += 1;
        results.errors.push({
          row: index + 2,
          message: 'Nama Lengkap dan NUPTK wajib diisi',
        });
        continue;
      }

      const jenisKelamin = normalizeGender(jenisKelaminRaw);

      if (mode === 'operator') {
        if (!satminkalFromQuery) {
          results.skipped += 1;
          results.errors.push({
            row: index + 2,
            message: 'SATMINKAL operator tidak ditemukan pada sesi import',
          });
          continue;
        }
        satminkal = satminkalFromQuery;
      } else {
        const trimmedSat = (satminkal || '').toString().trim();
        if (!trimmedSat) {
          results.skipped += 1;
          results.errors.push({
            row: index + 2,
            message: 'SATMINKAL wajib diisi untuk admin',
          });
          continue;
        }

        const key = trimmedSat.toLowerCase();
        if (!operatorSatminkalSet.has(key)) {
          results.skipped += 1;
          results.errors.push({
            row: index + 2,
            message:
              'SATMINKAL belum terdaftar di data operator. Silakan buat data operator terlebih dahulu di menu Data Operator.',
          });
          continue;
        }
      }

      try {
        await Faculty.create({
          name: String(name).trim(),
          nuptk: String(nuptk).trim(),
          nip: nip ? String(nip).trim() : null,
          nrg: nrg ? String(nrg).trim() : null,
          satminkal: satminkal ? String(satminkal).trim() : null,
          jenis_kelamin: jenisKelamin,
          position: 'Guru',
        });
        results.created += 1;
      } catch (err) {
        results.skipped += 1;
        results.errors.push({
          row: index + 2,
          message: err.message || 'Gagal menyimpan data guru',
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  } finally {
    try {
      fs.unlinkSync(path.resolve(filePath));
    } catch (_) {}
  }
};

// @desc    Download Excel template for faculties import
// @route   GET /api/faculties/import-template
// @access  Public/Private (no auth implemented)
exports.downloadFacultiesTemplate = (req, res, next) => {
  try {
    const mode = (req.query.mode || '').toString();

    const isOperatorTemplate = mode === 'operator';

    const header = isOperatorTemplate
      ? ['Nama Lengkap', 'Jenis Kelamin', 'NUPTK', 'NIP', 'NRG']
      : ['Nama Lengkap', 'Jenis Kelamin', 'NUPTK', 'NIP', 'NRG', 'SATMINKAL'];

    const exampleRow = isOperatorTemplate
      ? ['Contoh Nama Guru', 'Laki-laki', '1234567890', '198001012010011001', '1234567']
      : ['Contoh Nama Guru', 'Laki-laki', '1234567890', '198001012010011001', '1234567', 'SDN Contoh 01'];

    const data = [header, exampleRow];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const filename = isOperatorTemplate
      ? 'template_import_guru_operator.xlsx'
      : 'template_import_guru_admin.xlsx';

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    return res.send(buffer);
  } catch (error) {
    next(error);
  }
};

// Helper function to safely parse JSON string fields
function parseJSONFields(data) {
  const fieldsToParse = [
    'education',
    'publications',
    'courses',
    'hki',
    'pengabdian',
    'identitasPegawai',
    'skCpns',
    'skPns',
    'skPppk',
    'riwayatPangkat',
    'riwayatJabatan',
    'riwayatGaji',
    'pendidikanUmum',
    'diklat',
    'suamiIstri',
    'aktaAnak',
    'penilaianPrestasi',
    'penetapanAngkaKredit',
    'dokumenTambahan',
  ];
  fieldsToParse.forEach(field => {
    if (typeof data[field] === 'string') {
      try {
        data[field] = JSON.parse(data[field]);
      } catch (err) {
        throw new Error(`Invalid JSON format for ${field}`);
      }
    }
  });
  return data;
}
