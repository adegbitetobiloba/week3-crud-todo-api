require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.set("trust proxy", 1); // Render sits behind a proxy; needed for correct client IPs (rate limiting)
app.use(helmet());
app.use(
  cors({
    // Comma-separated list in CORS_ORIGINS, e.g. https://my-site.netlify.app. Defaults to any origin.
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()) : "*",
  })
);
app.use(express.json()); // MUST come before the routes, or req.body is empty
if (process.env.NODE_ENV !== "test") app.use(morgan("tiny"));

app.get("/", (req, res) => res.send("API running 🚀"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/students", studentRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

async function start() {
  if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
    console.error("Missing JWT_SECRET or MONGO_URI environment variable");
    process.exit(1);
  }
  await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

// Only start listening when run directly (node app.js), so tests can import `app`.
if (require.main === module) start();

module.exports = app;
