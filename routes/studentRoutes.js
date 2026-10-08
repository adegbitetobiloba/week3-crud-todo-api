const express = require("express");
const Student = require("../models/Student");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect); // every student route needs a valid login token

router.post("/", async (req, res) => {
  const { name, course } = req.body || {};
  if (!name || !course) return res.status(400).json({ error: "Required fields missing" });
  res.status(201).json(await Student.create({ name, course }));
});

router.get("/", async (req, res) => res.json(await Student.find()));

router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
