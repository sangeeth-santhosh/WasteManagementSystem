import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, maxlength: 2000 },
    subject: { type: String, default: '', maxlength: 200 },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;

