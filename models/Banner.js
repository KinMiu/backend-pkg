const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    nama: { type: String, default: '' },
    foto: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    imagePosition: { type: String, default: '50% 50%' },
    imageScale: { type: Number, default: 1 },
    hideHeroText: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const BannerModel = mongoose.model('Banner', bannerSchema);

const Banner = {
  async find(filter = {}) {
    const q = BannerModel.find();
    if (typeof filter.isActive === 'boolean') q.where('isActive', filter.isActive);
    const docs = await q.sort({ order: 1, createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString(), isActive: !!d.isActive, hideHeroText: !!d.hideHeroText }));
  },
  async findById(id) {
    const doc = await BannerModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString(), isActive: !!doc.isActive, hideHeroText: !!doc.hideHeroText };
  },
  async create(data) {
    const doc = await BannerModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await BannerModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString(), isActive: !!doc.isActive, hideHeroText: !!doc.hideHeroText };
  },
  async deleteOneById(id) {
    const result = await BannerModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Banner;
