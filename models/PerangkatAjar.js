const mongoose = require('mongoose');

const perangkatAjarSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    deskripsi: { type: String },
    kategori: { type: String },
    filePath: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String },
    fileSize: { type: Number },
  },
  { timestamps: true }
);

const PerangkatAjarModel = mongoose.model('PerangkatAjar', perangkatAjarSchema);

const PerangkatAjar = {
  async find() {
    const docs = await PerangkatAjarModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await PerangkatAjarModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await PerangkatAjarModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await PerangkatAjarModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await PerangkatAjarModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = PerangkatAjar;

