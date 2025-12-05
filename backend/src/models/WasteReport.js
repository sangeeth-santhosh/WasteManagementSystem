import mongoose from 'mongoose';

const wasteReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    wetKg: { type: Number, default: 0 },
    dryKg: { type: Number, default: 0 },
    plasticKg: { type: Number, default: 0 },
    eWasteKg: { type: Number, default: 0 },
    zone: { type: String, required: true, enum: ['A', 'B', 'C'] },
    details: { type: String, default: '' },
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

