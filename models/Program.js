const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProgramModel = mongoose.model('Program', programSchema);

const Program = {
  async find(filter = {}) {
    const q = ProgramModel.find();
    if (typeof filter.isActive === 'boolean') q.where('isActive', filter.isActive);
    const docs = await q.sort({ order: 1, createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString(), isActive: !!d.isActive }));
  },
  async findById(id) {
    const doc = await ProgramModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString(), isActive: !!doc.isActive };
  },
  async create(data) {
    const doc = await ProgramModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await ProgramModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString(), isActive: !!doc.isActive };
  },
  async deleteOneById(id) {
    const result = await ProgramModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Program;
