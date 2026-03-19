const mongoose = require('mongoose');

const suratSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    tanggal: { type: String },
    pdfFile: { type: String, required: true },
  },
  { timestamps: true }
);

const SuratModel = mongoose.model('Surat', suratSchema);

const Surat = {
  async find() {
    const docs = await SuratModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await SuratModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await SuratModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await SuratModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await SuratModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Surat;

