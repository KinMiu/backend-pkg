const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tahunlulus: { type: String, required: true },
    pekerjaan: { type: String, required: true },
    perusahaan: { type: String, required: true },
    image: { type: String, required: true },
    testimoni: { type: String, required: true },
  },
  { timestamps: true }
);

const TestimonialModel = mongoose.model('Testimonial', testimonialSchema);

const Testimonial = {
  async find() {
    const docs = await TestimonialModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await TestimonialModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await TestimonialModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await TestimonialModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await TestimonialModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Testimonial;
