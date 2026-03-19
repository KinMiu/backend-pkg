const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    deskripsi: { type: String, required: true },
    tanggal: { type: String, required: true },
    lokasi: { type: String, required: true },
    jenis: { type: String, required: true },
    foto: { type: String, default: '' },
    fotos: { type: [String], default: [] },
    satminkal: { type: String, default: '' },
    program: { type: String, default: '' },
  },
  { timestamps: true }
);

const EventModel = mongoose.model('Event', eventSchema);

const Event = {
  async find() {
    const docs = await EventModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await EventModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await EventModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await EventModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await EventModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Event;
