const mongoose = require('mongoose');

const structuralSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    jabatan: { type: String, required: true },
    foto: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const StructuralModel = mongoose.model('Structural', structuralSchema);

const Structural = {
  async find() {
    const docs = await StructuralModel.find().sort({ order: 1, createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await StructuralModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await StructuralModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await StructuralModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await StructuralModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Structural;
