import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const existingAdmin = await Admin.findOne({ email: "admin@test.com" });

    if (existingAdmin) {
      console.log("El administrador ya existe");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    const admin = new Admin({
      name: "Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    await admin.save();

    console.log("Administrador creado correctamente");
    process.exit();

  } catch (error) {
    console.error("Error al crear admin:", error.message);
    process.exit(1);
  }
};

createAdmin();