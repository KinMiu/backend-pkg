const mongoose = require('mongoose');

const kurikulumSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    deskripsi: { type: String, required: true },
    semester: { type: Number, required: true },
    mataKuliah: { type: mongoose.Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

const KurikulumModel = mongoose.model('Kurikulum', kurikulumSchema);

const Kurikulum = {
  async find() {
    const docs = await KurikulumModel.find().sort({ semester: 1, createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await KurikulumModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await KurikulumModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await KurikulumModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await KurikulumModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Kurikulum;
