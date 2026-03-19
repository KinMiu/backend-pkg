const mongoose = require('mongoose');

const resetPasswordRequestSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['operator', 'dosen'], required: true, index: true },
    identifier: { type: String, required: true }, // email / NUPTK that user submitted
    targetId: { type: String, required: true, index: true }, // Operator._id / Faculty._id
    newPasswordHash: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    requestedAt: { type: Date, default: Date.now, index: true },
    decidedAt: { type: Date, default: null },
    decidedBy: { type: String, default: null }, // admin username (optional)
  },
  { timestamps: true }
);

resetPasswordRequestSchema.index({ status: 1, requestedAt: -1 });
resetPasswordRequestSchema.index({ role: 1, targetId: 1, status: 1 });

module.exports = mongoose.model('ResetPasswordRequest', resetPasswordRequestSchema);

