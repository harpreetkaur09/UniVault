const dotenv = require("dotenv");

dotenv.config();

const requiredVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
];

const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mediaMongoUri: process.env.MEDIA_MONGO_URI || "",
  mediaDbName: process.env.MEDIA_DB_NAME || "univault_media",
  mediaStorageLimitMb:
    parseFloat(process.env.MEDIA_STORAGE_LIMIT_MB) > 0
      ? parseFloat(process.env.MEDIA_STORAGE_LIMIT_MB)
      : 400,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  teacherEmail: process.env.TEACHER_EMAIL || "",
  teacherPassword: process.env.TEACHER_PASSWORD || "",
};

if (config.nodeEnv === "production") {
  if (config.jwtSecret.length < 32) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters in production"
    );
  }

  if (config.adminPassword.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD must be at least 8 characters in production"
    );
  }

  if (config.clientUrl === "*" || config.clientUrl.includes("localhost")) {
    throw new Error(
      "CLIENT_URL must not be '*' or localhost in production"
    );
  }
}

module.exports = config;
