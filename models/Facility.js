const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    deskripsi: { type: String, required: true },
    foto: { type: String, default: '' },
  },
  { timestamps: true }
);

const FacilityModel = mongoose.model('Facility', facilitySchema);

const Facility = {
  async find() {
    const docs = await FacilityModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await FacilityModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await FacilityModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await FacilityModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await FacilityModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Facility;
