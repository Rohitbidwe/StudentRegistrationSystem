const form = document.getElementById('studentForm');
const tableBody = document.querySelector('tbody');

// 1. Load data from Local Storage when page opens
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

    // Validation
    if (name === "" || studentId === "" || email === "" || course === "") {
        alert("Error: All fields are required!");
        return;
    }
    if (isNaN(studentId)) {
        alert("Error: Student ID must be a numeric value.");
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        alert("Error: Please enter a valid email address.");
        return;
    }

    // Create Student Object
    const student = { name, studentId, email, course };

    // 2. Add to Table (UI)
    addRow(student);

    // 3. Save to Local Storage (Database)
    saveToStorage(student);

    form.reset();
});

// Helper Function: Add row to HTML Table
function addRow(student) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${student.name}</td>
        <td>${student.studentId}</td>
        <td>${student.email}</td>
        <td>${student.course}</td>
    `;
    tableBody.appendChild(newRow);
}

// Helper Function: Save to Browser Storage
function saveToStorage(student) {
    // Get existing data or empty array
    const students = JSON.parse(localStorage.getItem('students')) || [];
    
    // Add new student
    students.push(student);
    
    // Save back to storage
    localStorage.setItem('students', JSON.stringify(students));
}