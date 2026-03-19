const mongoose = require('mongoose');

const patentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    number: { type: String, required: true, unique: true },
    authors: { type: mongoose.Schema.Types.Mixed, default: [] },
    driveUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const PatentModel = mongoose.model('Patent', patentSchema);

const Patent = {
  async find() {
    const docs = await PatentModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await PatentModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await PatentModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await PatentModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await PatentModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Patent;
