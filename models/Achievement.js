const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    tahun: { type: String, required: true },
    mahasiswa: { type: mongoose.Schema.Types.Mixed, default: [] },
    deskripsi: { type: String, required: true },
    foto: { type: String, default: '' },
    satminkal: { type: String, default: null },
  },
  { timestamps: true }
);

const AchievementModel = mongoose.model('Achievement', achievementSchema);

const Achievement = {
  async find() {
    const docs = await AchievementModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await AchievementModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await AchievementModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await AchievementModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await AchievementModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Achievement;
