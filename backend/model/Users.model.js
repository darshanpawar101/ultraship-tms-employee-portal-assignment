import mongoose from "mongoose";
import bcrypt from "bcrypt";

const attendanceSchema = new mongoose.Schema({
  totalDays: {
    type: Number,
    default: 0,
  },
  presentDays: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["ADMIN", "EMPLOYEE"],
      default: "EMPLOYEE",
      required: true,
      index: true,
    },
    avatar: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
    subjects: {
      type: [String],
      default: [],
    },
    attendance: {
      type: attendanceSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

userSchema.pre("save", function () {
  if (this.attendance && this.attendance.totalDays > 0) {
    this.attendance.percentage =
      (this.attendance.presentDays / this.attendance.totalDays) * 100;
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ name: 1, role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ className: 1 });

export const User = mongoose.model("User", userSchema);
