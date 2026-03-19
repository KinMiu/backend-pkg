const mongoose = require('mongoose');

const statistikSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const StatistikModel = mongoose.model('Statistik', statistikSchema);

const Statistik = {
  async find() {
    const docs = await StatistikModel.find().sort({ order: 1, createdAt: 1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await StatistikModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await StatistikModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await StatistikModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await StatistikModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Statistik;
