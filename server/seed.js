const mongoose = require("mongoose");

const config = require("./config/env");
const User = require("./models/User");

const seedAdmin = async () => {
  const { adminEmail, adminPassword } = config;

  const existingUser = await User.findOne({ email: adminEmail }).select(
    "+password"
  );

  if (!existingUser) {
    await User.create({
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log(`Admin user created: ${adminEmail}`);
    return;
  }

  const isSamePassword = await existingUser.comparePassword(adminPassword);

  if (!isSamePassword) {
    existingUser.password = adminPassword;
    await existingUser.save();

    console.log(`Admin password updated: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }
};

const seedTeacher = async () => {
  const { teacherEmail, teacherPassword } = config;

  if (!teacherEmail || !teacherPassword) {
    console.log("TEACHER_EMAIL / TEACHER_PASSWORD not set — skipping teacher seed");
    return;
  }

  if (teacherEmail === config.adminEmail) {
    console.log("TEACHER_EMAIL matches ADMIN_EMAIL — skipping teacher seed");
    return;
  }

  const existing = await User.findOne({ email: teacherEmail }).select("+password");

  if (!existing) {
    await User.create({ email: teacherEmail, password: teacherPassword, role: "teacher" });
    console.log(`Teacher user created: ${teacherEmail}`);
    return;
  }

  if (existing.role !== "teacher") {
    console.log(`User ${teacherEmail} exists with role "${existing.role}" — left unchanged`);
    return;
  }

  if (!(await existing.comparePassword(teacherPassword))) {
    existing.password = teacherPassword;
    await existing.save();
    console.log(`Teacher password updated: ${teacherEmail}`);
  } else {
    console.log(`Teacher user already exists: ${teacherEmail}`);
  }
};

// Standalone execution
if (require.main === module) {
  const connectDB = require("./config/db");

  (async () => {
    try {
      await connectDB();
      await seedAdmin(); // <-- ADD THIS
      await seedTeacher();
    } catch (error) {
      console.error("Seed failed:", error.message);
      process.exitCode = 1;
    } finally {
      await mongoose.disconnect();
      console.log("Database disconnected");
    }
  })();
}

module.exports = seedAdmin;
module.exports.seedTeacher = seedTeacher;