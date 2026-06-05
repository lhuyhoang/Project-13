const User = require("../models/User");

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@blogviet.vn";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminUsername = process.env.ADMIN_USERNAME || "admin";

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      if (existing.role !== "admin") {
        existing.role = "admin";
        await existing.save();
        console.log(`[seed] Promoted existing user to admin: ${adminEmail}`);
      }
      return;
    }

    await User.create({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      bio: "Quản trị viên BlogViet",
    });

    console.log(
      `[seed] Default admin created — email: ${adminEmail} | password: ${adminPassword}`,
    );
  } catch (error) {
    console.error("[seed] Failed to seed admin:", error.message);
  }
};

module.exports = seedAdmin;
