import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../model/Users.model.js";
import { connectDB } from "../database/db.js";
import { seedUsers } from "./seedUsers.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    console.log("🗑️  Clearing existing users...");
    await User.deleteMany({});

    console.log("🌱 Seeding database with sample users...");

    for (const user of seedUsers) {
      const newUser = new User(user);
      await newUser.save();
    }

    console.log("✅ Database seeded successfully!");
    console.log("\n📝 Login credentials:");
    console.log("Admin - username: admin, password: admin123");
    console.log("Employee - username: john.doe, password: password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
