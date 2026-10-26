const mongoose = require("mongoose");

let pending = null;

// Safe to call on every request: it reuses an existing connection.
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!pending) {
    pending = mongoose
      .connect(process.env.MONGODB_URI)
      .then((conn) => console.log(`MongoDB connected: ${conn.connection.host}`))
      .finally(() => {
        pending = null;
      });
  }
  await pending;
};

module.exports = connectDB;
