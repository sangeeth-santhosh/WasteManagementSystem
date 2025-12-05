import mongoose from 'mongoose';
// TODO: Install bcryptjs package: npm install bcryptjs
// import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'collector'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('passwordHash')) {
    return next();
  }

  // TODO: Use bcrypt to hash password
  // const salt = await bcrypt.genSalt(10);
  // this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  
  // Placeholder: In production, uncomment above and remove this
  // For now, storing plain text (NOT SECURE - TODO: implement hashing)
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  // TODO: Use bcrypt to compare passwords
  // return await bcrypt.compare(candidatePassword, this.passwordHash);
  
  // Placeholder: In production, uncomment above and remove this
  // For now, simple comparison (NOT SECURE - TODO: implement bcrypt)
  return candidatePassword === this.passwordHash;
};

// Remove passwordHash from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;

