const mongoose = require('mongoose');

const hkiSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    number: { type: String, required: true, unique: true },
    authors: { type: mongoose.Schema.Types.Mixed, default: [] },
    driveUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const HkiModel = mongoose.model('Hki', hkiSchema);

const Hki = {
  async find() {
    const docs = await HkiModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await HkiModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await HkiModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await HkiModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await HkiModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Hki;
