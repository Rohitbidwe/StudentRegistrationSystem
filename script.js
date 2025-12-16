const form = document.getElementById('studentForm');
const tableBody = document.querySelector('tbody');

// 1. Load data on startup
document.addEventListener('DOMContentLoaded', function() {
    const storedStudents = JSON.parse(localStorage.getItem('students')) || [];
    storedStudents.forEach(student => addRow(student));
});

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const course = document.getElementById('course').value;

    if (name === "" || studentId === "" || email === "" || course === "") {
        alert("Error: All fields are required!");
        return;
    }
    if (isNaN(studentId)) {
        alert("Error: Student ID must be a numeric value.");
        return;
    }

    const student = { name, studentId, email, course };

    addRow(student);
    saveToStorage(student);
    form.reset();
});

// 2. Handle Delete Buttons (Event Delegation)
tableBody.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        // Remove from UI
        const row = event.target.parentElement.parentElement;
        const idToDelete = row.children[1].textContent; // Get Student ID from 2nd column
        row.remove();

        // Remove from Storage
        deleteFromStorage(idToDelete);
    }
});

function addRow(student) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${student.name}</td>
        <td>${student.studentId}</td>
        <td>${student.email}</td>
        <td>${student.course}</td>
        <td><button class="delete-btn" style="background-color:#dc3545; padding:5px 10px;">X</button></td>
    `;
    tableBody.appendChild(newRow);
}

function saveToStorage(student) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
}

function deleteFromStorage(id) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    // Filter out the student with the matching ID
    students = students.filter(student => student.studentId !== id);
    localStorage.setItem('students', JSON.stringify(students));
}