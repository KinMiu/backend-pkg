const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nuptk: { type: String, required: true, unique: true },
    nip: { type: String, default: null },
    nrg: { type: String, default: null },
    satminkal: { type: String, default: null },
    jenis_kelamin: { type: String, default: null },
    position: { type: String, default: 'Guru' },
    foto: { type: String, default: '' },
    passwordHash: { type: String, default: null },
    isResearchPublic: { type: Boolean, default: true },
    education: { type: mongoose.Schema.Types.Mixed, default: [] },
    courses: { type: mongoose.Schema.Types.Mixed, default: [] },
    publications: { type: mongoose.Schema.Types.Mixed, default: [] },
    hki: { type: mongoose.Schema.Types.Mixed, default: [] },
    pengabdian: { type: mongoose.Schema.Types.Mixed, default: [] },
    identitasPegawai: { type: mongoose.Schema.Types.Mixed, default: [] },
    skCpns: { type: mongoose.Schema.Types.Mixed, default: [] },
    skPns: { type: mongoose.Schema.Types.Mixed, default: [] },
    skPppk: { type: mongoose.Schema.Types.Mixed, default: [] },
    riwayatPangkat: { type: mongoose.Schema.Types.Mixed, default: [] },
    riwayatJabatan: { type: mongoose.Schema.Types.Mixed, default: [] },
    riwayatGaji: { type: mongoose.Schema.Types.Mixed, default: [] },
    pendidikanUmum: { type: mongoose.Schema.Types.Mixed, default: [] },
    diklat: { type: mongoose.Schema.Types.Mixed, default: [] },
    suamiIstri: { type: mongoose.Schema.Types.Mixed, default: [] },
    aktaAnak: { type: mongoose.Schema.Types.Mixed, default: [] },
    penilaianPrestasi: { type: mongoose.Schema.Types.Mixed, default: [] },
    penetapanAngkaKredit: { type: mongoose.Schema.Types.Mixed, default: [] },
    dokumenTambahan: { type: mongoose.Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

const FacultyModel = mongoose.model('Faculty', facultySchema);

function mapFaculty(doc) {
  if (!doc) return null;
  const d = doc.toObject ? doc.toObject() : doc;
  const id = d._id && d._id.toString ? d._id.toString() : String(d._id);
  return {
    ...d,
    _id: id,
    id,
    jenisKelamin: d.jenis_kelamin,
    isResearchPublic: !!d.isResearchPublic,
  };
}

const Faculty = {
  async find() {
    const docs = await FacultyModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => mapFaculty({ ...d }));
  },
  async findById(id) {
    const doc = await FacultyModel.findById(id).lean();
    if (!doc) return null;
    return mapFaculty(doc);
  },
  async findOneByNuptkWithPassword(nuptk) {
    const doc = await FacultyModel.findOne({ nuptk }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), _id: doc._id.toString() };
  },
  async create(data) {
    const doc = await FacultyModel.create(data);
    return this.findById(doc._id);
  },
  async findByIdAndUpdate(id, data) {
    const update = { ...data };
    if (update.jenisKelamin !== undefined) {
      update.jenis_kelamin = update.jenisKelamin;
      delete update.jenisKelamin;
    }
    const doc = await FacultyModel.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!doc) return null;
    return mapFaculty(doc);
  },
  async deleteOneById(id) {
    const result = await FacultyModel.findByIdAndDelete(id);
    return !!result;
  },
  async setResearchVisibilityAll(isResearchPublic) {
    const result = await FacultyModel.updateMany({}, { isResearchPublic });
    return { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount };
  },
};

module.exports = Faculty;
