const path = require('path');
const fs = require('fs');
const PerangkatAjar = require('../models/PerangkatAjar');
const Faculty = require('../models/Faculty');
const Operator = require('../models/Operator');
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');

const UPLOADS_ROOT = path.join(__dirname, '../public/uploads');

const safeUnlink = async (absPath) => {
  try {
    await fs.promises.unlink(absPath);
  } catch (_) {}
};

exports.getAllPerangkatAjar = async (req, res, next) => {
  try {
    const list = await PerangkatAjar.find();
    res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPerangkatAjarById = async (req, res, next) => {
  try {
    const item = await PerangkatAjar.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Perangkat ajar not found',
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

exports.createPerangkatAjar = async (req, res, next) => {
  try {
    const { judul, deskripsi, kategori } = req.body;

    if (!judul) {
      return res.status(400).json({
        success: false,
        error: 'Judul perangkat ajar is required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'File perangkat ajar is required',
      });
    }

    const relativePath = path
      .relative(UPLOADS_ROOT, req.file.path)
      .replace(/\\/g, '/');

    const item = await PerangkatAjar.create({
      judul,
      deskripsi,
      kategori,
      filePath: relativePath,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePerangkatAjar = async (req, res, next) => {
  try {
    const existing = await PerangkatAjar.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Perangkat ajar not found',
      });
    }

    const updateData = {
      judul: req.body.judul,
      deskripsi: req.body.deskripsi,
      kategori: req.body.kategori,
    };

    if (req.file) {
      const relativePath = path
        .relative(UPLOADS_ROOT, req.file.path)
        .replace(/\\/g, '/');
      updateData.filePath = relativePath;
      updateData.originalName = req.file.originalname;
      updateData.mimeType = req.file.mimetype;
      updateData.fileSize = req.file.size;

      if (existing.filePath) {
        const absOld = path.join(UPLOADS_ROOT, existing.filePath);
        await safeUnlink(absOld);
      }
    }

    const updated = await PerangkatAjar.findByIdAndUpdate(req.params.id, updateData);

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePerangkatAjar = async (req, res, next) => {
  try {
    const existing = await PerangkatAjar.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Perangkat ajar not found',
      });
    }

    await PerangkatAjar.deleteOneById(req.params.id);

    if (existing.filePath) {
      const absOld = path.join(UPLOADS_ROOT, existing.filePath);
      await safeUnlink(absOld);
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Public password-only check across admin, operator, and faculty accounts
exports.checkPerangkatAjarPassword = async (req, res, next) => {
  try {
    const { password } = req.body || {};
    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Password is required',
      });
    }

    const plain = String(password);

    // 1) Check admin users
    const adminUsers = await AdminUser.find({});
    for (const admin of adminUsers) {
      if (admin.passwordHash && (await bcrypt.compare(plain, admin.passwordHash))) {
        return res.status(200).json({ success: true, data: { role: 'admin' } });
      }
    }

    // 2) Check operators
    const operatorRow = await Operator.findOneByPassword?.(plain);
    if (operatorRow) {
      return res.status(200).json({ success: true, data: { role: 'operator' } });
    }

    // Fallback: if Operator model doesn't expose helper above, scan all with password_hash
    if (!operatorRow) {
      const operators = await Operator.findAllWithPasswordHash?.();
      if (Array.isArray(operators)) {
        for (const op of operators) {
          if (op.password_hash && (await bcrypt.compare(plain, op.password_hash))) {
            return res.status(200).json({ success: true, data: { role: 'operator' } });
          }
        }
      }
    }

    // 3) Check faculty/guru
    const facultyRow = await Faculty.findOneByPassword?.(plain);
    if (facultyRow) {
      return res.status(200).json({ success: true, data: { role: 'dosen' } });
    }

    // Fallback: if Faculty model doesn't expose helper above, try scanning a limited set
    if (!facultyRow && Faculty.findManyWithPasswordHash) {
      const docs = await Faculty.findManyWithPasswordHash();
      for (const f of docs) {
        if (f.passwordHash && (await bcrypt.compare(plain, f.passwordHash))) {
          return res.status(200).json({ success: true, data: { role: 'dosen' } });
        }
      }
    }

    return res.status(401).json({
      success: false,
      error: 'Password tidak cocok dengan akun manapun',
    });
  } catch (error) {
    next(error);
  }
};


