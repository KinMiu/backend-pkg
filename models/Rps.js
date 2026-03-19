const mongoose = require('mongoose');

const rpsSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    pdfFile: { type: String, required: true },
  },
  { timestamps: true }
);

const RpsModel = mongoose.model('Rps', rpsSchema);

const Rps = {
  async find() {
    const docs = await RpsModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await RpsModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await RpsModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await RpsModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await RpsModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Rps;
