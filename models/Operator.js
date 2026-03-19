const mongoose = require('mongoose');

const operatorSchema = new mongoose.Schema(
  {
    satminkal: { type: String, required: true },
    npsn: { type: String, required: true },
    email: { type: String, default: null },
    password_hash: { type: String, default: null },
    latitude: { type: String, default: '' },
    longitude: { type: String, default: '' },
    linkGoogleMaps: { type: String, default: '' },
  },
  { timestamps: true }
);

operatorSchema.index({ email: 1 }, { unique: true, sparse: true });

const OperatorModel = mongoose.model('Operator', operatorSchema);

const Operator = {
  async find() {
    const docs = await OperatorModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, id: d._id.toString(), _id: d._id.toString() }));
  },
  async findById(id) {
    const doc = await OperatorModel.findById(id).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async findOneByEmailWithPassword(email) {
    const doc = await OperatorModel.findOne({ email: email.toLowerCase() }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await OperatorModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const doc = await OperatorModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async deleteOneById(id) {
    const result = await OperatorModel.findByIdAndDelete(id);
    return !!result;
  },
};

module.exports = Operator;
