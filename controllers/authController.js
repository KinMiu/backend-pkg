const Faculty = require('../models/Faculty');
const Operator = require('../models/Operator');
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');
const ResetPasswordRequest = require('../models/ResetPasswordRequest');

const DEFAULT_DOSEN_PASSWORD = '12345678';
const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin123';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12345678';

async function ensureAdminUser() {
  // Jika sudah ada admin user di database (hasil perubahan username admin, dst),
  // jangan buat admin default lagi supaya username tidak "balik".
  const anyAdmin = await AdminUser.findOne({});
  if (anyAdmin) return anyAdmin;

  const username = String(DEFAULT_ADMIN_USERNAME || '').trim();
  if (!username) return null;

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(String(DEFAULT_ADMIN_PASSWORD), salt);
  const created = await AdminUser.create({ username, passwordHash });
  return created;
}

// @desc    Login guru by NUPTK + password
// @route   POST /api/auth/dosen/login
// @access  Public
exports.loginDosen = async (req, res, next) => {
  try {
    const { nuptk, password } = req.body || {};

    if (!nuptk || !password) {
      return res.status(400).json({ success: false, error: 'nuptk and password are required' });
    }

    const row = await Faculty.findOneByNuptkWithPassword(nuptk.trim());
    if (!row) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const hasCustomPassword = !!row.passwordHash;
    const ok = hasCustomPassword
      ? await bcrypt.compare(password, row.passwordHash)
      : password === DEFAULT_DOSEN_PASSWORD;

    if (!ok) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    return res.status(200).json({
      success: true,
      data: {
        facultyId: row.id,
        nuptk: row.nuptk,
        name: row.name,
        hasCustomPassword
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change guru password (by nuptk + current password)
// @route   POST /api/auth/dosen/change-password
// @access  Public
exports.changeDosenPassword = async (req, res, next) => {
  try {
    const { nuptk, currentPassword, newPassword } = req.body || {};

    if (!nuptk || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'nuptk, currentPassword, newPassword are required' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'newPassword must be at least 8 characters' });
    }

    const row = await Faculty.findOneByNuptkWithPassword(nuptk.trim());
    if (!row) {
      return res.status(404).json({ success: false, error: 'Faculty not found' });
    }

    const hasCustomPassword = !!row.passwordHash;
    const ok = hasCustomPassword
      ? await bcrypt.compare(currentPassword, row.passwordHash)
      : currentPassword === DEFAULT_DOSEN_PASSWORD;

    if (!ok) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await Faculty.findByIdAndUpdate(row.id, { passwordHash });

    return res.status(200).json({ success: true, data: { nuptk: row.nuptk } });
  } catch (error) {
    next(error);
  }
};

// @desc    Login operator by email + password
// @route   POST /api/auth/operator/login
// @access  Public
exports.loginOperator = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'email and password are required' });
    }

    const row = await Operator.findOneByEmailWithPassword((email || '').trim().toLowerCase());
    if (!row) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (!row.password_hash) {
      return res.status(401).json({ success: false, error: 'Operator account has no password set. Please contact admin.' });
    }

    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    return res.status(200).json({
      success: true,
      data: {
        operatorId: String(row.id),
        satminkal: row.satminkal || '',
        npsn: row.npsn || '',
        email: row.email || '',
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change operator password (by email + current password)
// @route   POST /api/auth/operator/change-password
// @access  Public
exports.changeOperatorPassword = async (req, res, next) => {
  try {
    const { email, currentPassword, newPassword } = req.body || {};

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'email, currentPassword, newPassword are required' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'newPassword must be at least 6 characters' });
    }

    const row = await Operator.findOneByEmailWithPassword((email || '').trim().toLowerCase());
    if (!row) {
      return res.status(404).json({ success: false, error: 'Operator not found' });
    }

    if (!row.password_hash) {
      return res.status(401).json({ success: false, error: 'Operator account has no password set' });
    }

    const ok = await bcrypt.compare(currentPassword, row.password_hash);
    if (!ok) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await Operator.findByIdAndUpdate(row.id, { password_hash: passwordHash });

    return res.status(200).json({ success: true, data: { email: row.email } });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset operator password (by email + new password)
// @route   POST /api/auth/operator/reset-password
// @access  Public
exports.resetOperatorPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body || {};

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, error: 'email and newPassword are required' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'newPassword must be at least 6 characters' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const row = await Operator.findOne({ email: normalizedEmail });
    if (!row) {
      return res.status(404).json({ success: false, error: 'Operator not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(String(newPassword), salt);
    await Operator.updateOne({ _id: row._id }, { $set: { password_hash: passwordHash } });

    return res.status(200).json({ success: true, data: { email: row.email } });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password (Admin / Guru / Operator) by identifier
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { identifier, newPassword } = req.body || {};

    if (!identifier || !newPassword) {
      return res.status(400).json({ success: false, error: 'identifier and newPassword are required' });
    }

    const raw = String(identifier).trim();
    if (!raw) {
      return res.status(400).json({ success: false, error: 'identifier is required' });
    }

    const isEmailLike = raw.includes('@');

    // Try operator by email (when user types an email)
    if (isEmailLike) {
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'newPassword must be at least 6 characters' });
      }
      const email = raw.toLowerCase();
      const op = await Operator.findOneByEmailWithPassword(email);
      if (!op) {
        return res.status(404).json({ success: false, error: 'Account not found' });
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(String(newPassword), salt);
      await Operator.findByIdAndUpdate(op.id, { password_hash: passwordHash });
      return res.status(200).json({ success: true, data: { role: 'operator', identifier: op.email || email } });
    }

    // Try admin by username
    await ensureAdminUser();
    const admin = await AdminUser.findOne({ username: raw });
    if (admin) {
      if (typeof newPassword !== 'string' || newPassword.length < 8) {
        return res.status(400).json({ success: false, error: 'newPassword must be at least 8 characters' });
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(String(newPassword), salt);
      await AdminUser.updateOne({ _id: admin._id }, { $set: { passwordHash } });
      return res.status(200).json({ success: true, data: { role: 'admin', identifier: admin.username } });
    }

    // Try dosen by NUPTK
    const dosen = await Faculty.findOneByNuptkWithPassword(raw);
    if (dosen) {
      if (typeof newPassword !== 'string' || newPassword.length < 8) {
        return res.status(400).json({ success: false, error: 'newPassword must be at least 8 characters' });
      }
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(String(newPassword), salt);
      await Faculty.findByIdAndUpdate(dosen.id, { passwordHash });
      return res.status(200).json({ success: true, data: { role: 'dosen', identifier: dosen.nuptk } });
    }

    return res.status(404).json({ success: false, error: 'Account not found' });
  } catch (error) {
    next(error);
  }
};

// @desc    Request reset password (Operator / Guru) pending approval by admin
// @route   POST /api/auth/request-reset-password
// @access  Public
exports.requestResetPassword = async (req, res, next) => {
  try {
    const { identifier, newPassword } = req.body || {};

    if (!identifier || !newPassword) {
      return res.status(400).json({ success: false, error: 'identifier and newPassword are required' });
    }

    const raw = String(identifier).trim();
    if (!raw) {
      return res.status(400).json({ success: false, error: 'identifier is required' });
    }

    const isEmailLike = raw.includes('@');

    if (isEmailLike) {
      // Operator request by email
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'newPassword must be at least 6 characters' });
      }
      const email = raw.toLowerCase();
      const op = await Operator.findOneByEmailWithPassword(email);
      if (!op) {
        return res.status(404).json({ success: false, error: 'Account not found' });
      }

      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(String(newPassword), salt);

      const existing = await ResetPasswordRequest.findOne({
        role: 'operator',
        targetId: String(op.id),
        status: 'pending',
      });

      const doc = existing
        ? await ResetPasswordRequest.findByIdAndUpdate(
            existing._id,
            { identifier: email, newPasswordHash, requestedAt: new Date() },
            { new: true }
          )
        : await ResetPasswordRequest.create({
            role: 'operator',
            identifier: email,
            targetId: String(op.id),
            newPasswordHash,
            status: 'pending',
            requestedAt: new Date(),
          });

      return res.status(200).json({
        success: true,
        data: { requestId: String(doc._id), role: 'operator', identifier: email, status: 'pending' },
      });
    }

    // Disallow admin reset via public request flow
    await ensureAdminUser();
    const admin = await AdminUser.findOne({ username: raw });
    if (admin) {
      return res.status(400).json({
        success: false,
        error: 'Admin reset harus melalui menu admin (persetujuan/reset).',
      });
    }

    // Guru request by NUPTK
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'newPassword must be at least 8 characters' });
    }
    const dosen = await Faculty.findOneByNuptkWithPassword(raw);
    if (!dosen) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(String(newPassword), salt);

    const existing = await ResetPasswordRequest.findOne({
      role: 'dosen',
      targetId: String(dosen.id),
      status: 'pending',
    });

    const doc = existing
      ? await ResetPasswordRequest.findByIdAndUpdate(
          existing._id,
          { identifier: raw, newPasswordHash, requestedAt: new Date() },
          { new: true }
        )
      : await ResetPasswordRequest.create({
          role: 'dosen',
          identifier: raw,
          targetId: String(dosen.id),
          newPasswordHash,
          status: 'pending',
          requestedAt: new Date(),
        });

    return res.status(200).json({
      success: true,
      data: { requestId: String(doc._id), role: 'dosen', identifier: raw, status: 'pending' },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List reset password requests (pending by default)
// @route   GET /api/auth/reset-requests?status=pending
// @access  Public (UI restricts to admin)
exports.listResetRequests = async (req, res, next) => {
  try {
    const status = String(req.query?.status || 'pending');
    const allowed = ['pending', 'approved', 'rejected'];
    const s = allowed.includes(status) ? status : 'pending';

    const docs = await ResetPasswordRequest.find({ status: s })
      .sort({ requestedAt: -1, createdAt: -1 })
      .lean();

    const data = docs.map((d) => ({
      id: String(d._id),
      role: d.role,
      identifier: d.identifier,
      targetId: d.targetId,
      status: d.status,
      requestedAt: d.requestedAt,
      decidedAt: d.decidedAt,
      decidedBy: d.decidedBy,
    }));

    return res.status(200).json({ success: true, data, count: data.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve reset password request
// @route   POST /api/auth/reset-requests/:id/approve
// @access  Public (UI restricts to admin)
exports.approveResetRequest = async (req, res, next) => {
  try {
    const id = String(req.params?.id || '').trim();
    const decidedBy = String(req.body?.decidedBy || '').trim() || null;
    if (!id) return res.status(400).json({ success: false, error: 'id is required' });

    const doc = await ResetPasswordRequest.findById(id);
    if (!doc) return res.status(404).json({ success: false, error: 'Request not found' });
    if (doc.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Request already decided' });
    }

    if (doc.role === 'operator') {
      await Operator.findByIdAndUpdate(doc.targetId, { password_hash: doc.newPasswordHash });
    } else if (doc.role === 'dosen') {
      await Faculty.findByIdAndUpdate(doc.targetId, { passwordHash: doc.newPasswordHash });
    } else {
      return res.status(400).json({ success: false, error: 'Unsupported role' });
    }

    doc.status = 'approved';
    doc.decidedAt = new Date();
    doc.decidedBy = decidedBy;
    await doc.save();

    return res.status(200).json({ success: true, data: { id: String(doc._id), status: doc.status } });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject reset password request
// @route   POST /api/auth/reset-requests/:id/reject
// @access  Public (UI restricts to admin)
exports.rejectResetRequest = async (req, res, next) => {
  try {
    const id = String(req.params?.id || '').trim();
    const decidedBy = String(req.body?.decidedBy || '').trim() || null;
    if (!id) return res.status(400).json({ success: false, error: 'id is required' });

    const doc = await ResetPasswordRequest.findById(id);
    if (!doc) return res.status(404).json({ success: false, error: 'Request not found' });
    if (doc.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Request already decided' });
    }

    doc.status = 'rejected';
    doc.decidedAt = new Date();
    doc.decidedBy = decidedBy;
    await doc.save();

    return res.status(200).json({ success: true, data: { id: String(doc._id), status: doc.status } });
  } catch (error) {
    next(error);
  }
};

// @desc    Login admin by username + password
// @route   POST /api/auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'username and password are required' });
    }

    await ensureAdminUser();

    const uname = String(username).trim();
    const row = await AdminUser.findOne({ username: uname });
    if (!row) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(String(password), row.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    return res.status(200).json({
      success: true,
      data: { username: row.username }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change admin password (by username + current password)
// @route   POST /api/auth/admin/change-password
// @access  Public
exports.changeAdminPassword = async (req, res, next) => {
  try {
    const { username, currentPassword, newPassword } = req.body || {};

    if (!username || !currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, error: 'username, currentPassword, newPassword are required' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'newPassword must be at least 8 characters' });
    }

    await ensureAdminUser();

    const uname = String(username).trim();
    const row = await AdminUser.findOne({ username: uname });
    if (!row) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }

    const ok = await bcrypt.compare(String(currentPassword), row.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(String(newPassword), salt);
    await AdminUser.updateOne({ _id: row._id }, { $set: { passwordHash } });

    return res.status(200).json({ success: true, data: { username: row.username } });
  } catch (error) {
    next(error);
  }
};

// @desc    Change admin username (by username + current password)
// @route   POST /api/auth/admin/change-username
// @access  Public
exports.changeAdminUsername = async (req, res, next) => {
  try {
    const { username, currentPassword, newUsername } = req.body || {};

    if (!username || !currentPassword || !newUsername) {
      return res
        .status(400)
        .json({ success: false, error: 'username, currentPassword, newUsername are required' });
    }

    const uname = String(username).trim();
    const nextUname = String(newUsername).trim();
    if (!nextUname) {
      return res.status(400).json({ success: false, error: 'newUsername is required' });
    }

    await ensureAdminUser();

    const row = await AdminUser.findOne({ username: uname });
    if (!row) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }

    const ok = await bcrypt.compare(String(currentPassword), row.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    if (nextUname === uname) {
      return res.status(400).json({ success: false, error: 'newUsername must be different' });
    }

    const existing = await AdminUser.findOne({ username: nextUname });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Username already taken' });
    }

    await AdminUser.updateOne({ _id: row._id }, { $set: { username: nextUname } });

    return res.status(200).json({ success: true, data: { username: nextUname } });
  } catch (error) {
    next(error);
  }
};
