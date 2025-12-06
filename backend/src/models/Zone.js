import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['street-bin', 'apartment', 'market', 'institution', 'office', 'other'], default: 'other' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const zoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    places: [placeSchema],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Zone = mongoose.model('Zone', zoneSchema);

export default Zone;



