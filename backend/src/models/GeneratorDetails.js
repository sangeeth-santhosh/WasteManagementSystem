import mongoose from 'mongoose';

const generatorDetailsSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WasteReport',
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    generatorType: {
      type: String,
      enum: ['household', 'shop', 'institution', 'office', 'apartment'],
      required: true,
    },
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zone',
    },
    placeId: {
      type: String,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const GeneratorDetails = mongoose.model('GeneratorDetails', generatorDetailsSchema);

export default GeneratorDetails;




