 // IMPORT EXPRESS
const express = require('express');
const app = express();
require('dotenv').config();

// MIDDLEWARE (to read JSON)
app.use(express.json());

// NEW IMPRO
app.get('/', (req, res) => {
    res.send('Welcome to Tobi’s Todo API 🚀');
});

// FAKE DATABASE
let students = [];

// =============================
// CREATE STUDENT (POST)
// =============================
app.post('/students', (req, res) => {
    const { name, course } = req.body;

    // VALIDATION
    if (!name || !course) {
        return res.status(400).json({ error: 'Name and course required' });
    }

    const newStudent = {
        id: students.length + 1,
        name,
        course,
        active: true
    };

    students.push(newStudent);

    res.status(201).json(newStudent);
});

// =============================
// GET ALL STUDENTS (GET)
// =============================
app.get('/students', (req, res) => {
    res.json(students);
});

// =============================
// GET ONE STUDENT (GET)
// =============================
app.get('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
});

// =============================
// UPDATE STUDENT (PUT)
// =============================
app.put('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, course, active } = req.body;

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }

    // UPDATE ONLY PROVIDED FIELDS
    if (name !== undefined) student.name = name;
    if (course !== undefined) student.course = course;
    if (active !== undefined) student.active = active;

    res.json(student);
});

// =============================
// DELETE STUDENT (DELETE)
// =============================
app.delete('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const exists = students.some(s => s.id === id);

    if (!exists) {
        return res.status(404).json({ error: 'Student not found' });
    }

    students = students.filter(s => s.id !== id);

    res.json({ message: 'Student deleted successfully' });
});

// =============================
// START SERVER
// =============================
require('dotenv').config(); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


require('dotenv').config();