import mongoose from 'mongoose';

const wasteReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    wetKg: { type: Number, default: 0 },
    dryKg: { type: Number, default: 0 },
    plasticKg: { type: Number, default: 0 },
    eWasteKg: { type: Number, default: 0 },
    zone: { type: String, default: '' },
    details: { type: String, default: '' },
    zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
    zoneNameSnapshot: { type: String, default: '' },
    placeId: { type: String, default: '' },
    placeNameSnapshot: { type: String, default: '' },
    generatorDetailsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GeneratorDetails',
    },
    generatorType: {
      type: String,
      enum: ['household', 'shop', 'institution', 'office', 'apartment'],
    },
    generatorDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Collected', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

const WasteReport = mongoose.model('WasteReport', wasteReportSchema);

export default WasteReport;

