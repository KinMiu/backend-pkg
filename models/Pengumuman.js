const mongoose = require('mongoose');

const pengumumanSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    deskripsi: { type: String, required: true },
    tanggal: { type: String, required: true },
    lokasi: { type: String, default: '' },
    jenis: { type: String, required: true },
    foto: { type: String, default: '' },
    fotos: { type: [String], default: [] },
    satminkal: { type: String, default: '' },
  },
  { timestamps: true }
);

const PengumumanModel = mongoose.model('Pengumuman', pengumumanSchema);

const Pengumuman = {
  async find() {
    const docs = await PengumumanModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await PengumumanModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await PengumumanModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await PengumumanModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await PengumumanModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Pengumuman;
