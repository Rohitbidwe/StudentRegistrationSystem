const form = document.getElementById('studentForm');
const tableBody = document.querySelector('tbody');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    // 1. Get values
    const name = document.getElementById('name').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const course = document.getElementById('course').value;

    // 2. VALIDATION LOGIC
    // Check for empty fields
    if (name === "" || studentId === "" || email === "" || course === "") {
        alert("Error: All fields are required!");
        return; // Stop the function here
    }

    // Check if Student ID is actually a number
    if (isNaN(studentId)) {
        alert("Error: Student ID must be a numeric value.");
        return; // Stop the function here
    }

    // Check if Email contains '@' and '.' (Basic check)
    if (!email.includes('@') || !email.includes('.')) {
        alert("Error: Please enter a valid email address.");
        return; // Stop the function here
    }

    // 3. If validation passes, create the row
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${name}</td>
        <td>${studentId}</td>
        <td>${email}</td>
        <td>${course}</td>
    `;

    tableBody.appendChild(newRow);

    // 4. Clear form
    form.reset();
});