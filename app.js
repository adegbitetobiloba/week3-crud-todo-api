 // IMPORT EXPRESS
const express = require('express');
const app = express();

require('dotenv').config();
// IMPORT MONGOOSE
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected ✅'))
.catch(err => console.log(err));
if (!process.env.MONGO_URI) {
    console.log("MONGO_URI is missing ❌");
}

//IMPORT BYCRYPT
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);


// temporary debug
console.log("ENV CHECK:", process.env.MONGO_URI);

// MIDDLEWARE (to read JSON)
app.use(express.json());

// NEW IMPRO
app.get('/',auth, (req, res) => {
    res.send('Welcome to Tobi’s Todo API 🚀');
});

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

const Student = mongoose.model('Student', studentSchema);

// =============================
// CREATE STUDENT (POST)
// =============================
app.post('/students',auth, async (req, res) => {
    try {
        const { name, course } = req.body;

        if (!name || !course) {
            return res.status(400).json({ error: 'Name and course required' });
        }

        const student = new Student({ name, course });
        await student.save();

        res.status(201).json(student);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
 
// =============================
//POST REGISTER NEW STUDENT
// =============================
app.post('/register',auth, async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.json({ message: 'User registered' });
});

// =============================
//POST LOGIN NEW STUDENT
// =============================
const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
    console.log(req.body); // 👈 ADD THIS

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token });
});

// =============================
// GET ALL STUDENTS (GET)
// =============================
app.get('/students',auth, async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// =============================
// GET ONE STUDENT (GET)
// =============================
app.get('/students/:id',auth, async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).json({ error: 'Not found' });
    }

    res.json(student);
});

// =============================
// UPDATE STUDENT (PUT)
// =============================
app.put('/students/:id',auth, async (req, res) => {
    const student = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(student);
});

// =============================
// DELETE STUDENT (DELETE)
// =============================
app.delete('/students/:id',auth, async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});


// AUTH MIDDLEWARE
function auth(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ error: 'Access denied' });
    }

    const token = header.split(' ')[1];

    try {
        const verified = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
}
// =============================
// START SERVER
// =============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


