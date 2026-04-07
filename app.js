const express = require('express');
const app = express();
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cors = require('cors');
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// CONNECT DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected ✅'))
.catch(err => console.log(err));

// ================= USER MODEL =================
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// ================= STUDENT MODEL =================
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    course: { type: String, required: true },
    active: { type: Boolean, default: true }
});
const Student = mongoose.model('Student', studentSchema);

// ================= AUTH MIDDLEWARE =================
function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}

// ================= ROUTES =================

// ROOT
app.get('/', (req, res) => {
    res.send('API running 🚀');
});


app.get('/debug-users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// REGISTER
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("REGISTER DATA:", email, password);

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({ email, password: hashed });

        await user.save();

        console.log("USER SAVED:", user);

        res.json({ message: 'Registered successfully' });

    } catch (err) {
        console.log("REGISTER ERROR:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Wrong password' });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { email: user.email } });

    } catch {
        res.status(500).json({ error: 'Server error' });
    }
});

// CREATE STUDENT
app.post('/students', auth, async (req, res) => {
    try {
        const { name, course } = req.body;

        if (!name || !course) {
            return res.status(400).json({ error: 'Required fields missing' });
        }

        const student = new Student({ name, course });
        await student.save();

        res.status(201).json(student);

    } catch {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET ALL
app.get('/students', auth, async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE
app.delete('/students/:id', auth, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});