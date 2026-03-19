const mongoose = require('mongoose');

const greetingSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    jabatan: { type: String, required: true },
    kataSambutan: { type: String, required: true },
    foto: { type: String, required: true },
  },
  { timestamps: true }
);

const GreetingModel = mongoose.model('Greeting', greetingSchema);

const Greeting = {
  async find() {
    const docs = await GreetingModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findOneLatest() {
    const doc = await GreetingModel.findOne().sort({ createdAt: -1 }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async findById(id) {
    const doc = await GreetingModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await GreetingModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await GreetingModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await GreetingModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Greeting;
