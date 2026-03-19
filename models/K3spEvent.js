const mongoose = require('mongoose');

const k3spEventSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    deskripsi: { type: String, required: true },
    tanggal: { type: String, required: true },
    lokasi: { type: String, required: true },
    jenis: { type: String, required: true },
    foto: { type: String, default: '' },
    fotos: { type: [String], default: [] },
  },
  { timestamps: true }
);

const K3spEventModel = mongoose.model('K3spEvent', k3spEventSchema);

const K3spEvent = {
  async find() {
    const docs = await K3spEventModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await K3spEventModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await K3spEventModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await K3spEventModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await K3spEventModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = K3spEvent;

