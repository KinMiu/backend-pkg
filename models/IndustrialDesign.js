const mongoose = require('mongoose');

const industrialDesignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    number: { type: String, required: true, unique: true },
    authors: { type: mongoose.Schema.Types.Mixed, default: [] },
    driveUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const IndustrialDesignModel = mongoose.model('IndustrialDesign', industrialDesignSchema);

const IndustrialDesign = {
  async find() {
    const docs = await IndustrialDesignModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await IndustrialDesignModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await IndustrialDesignModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await IndustrialDesignModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await IndustrialDesignModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = IndustrialDesign;
