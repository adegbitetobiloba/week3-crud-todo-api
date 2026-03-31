const API = "https://your-render-link.onrender.com";

let token = "";

// REGISTER
async function register() {
    const email = prompt("Enter email");
    const password = prompt("Enter password");

    const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.message);
}

// LOGIN
async function login() {
    const email = prompt("Enter email");
    const password = prompt("Enter password");

    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
        token = data.token;
        alert("Login successful");
    } else {
        alert(data.error);
    }
}

// ADD STUDENT
async function addStudent() {
    const name = document.getElementById('name').value;
    const course = document.getElementById('course').value;

    await fetch(`${API}/students`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ name, course })
    });

    loadStudents();
}

// LOAD STUDENTS
async function loadStudents() {
    const res = await fetch(`${API}/students`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await res.json();

    const list = document.getElementById('list');
    list.innerHTML = "";

    data.forEach(s => {
        const li = document.createElement('li');

        li.innerHTML = `
            ${s.name} - ${s.course}
            <button onclick="deleteStudent('${s._id}')">❌</button>
        `;

        list.appendChild(li);
    });
}

// DELETE
async function deleteStudent(id) {
    await fetch(`${API}/students/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    loadStudents();
}