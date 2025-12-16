// Select the form and the table body from the DOM
const form = document.getElementById('studentForm');
const tableBody = document.querySelector('tbody'); // Selects the first tbody found

// Add an event listener for the form submission
form.addEventListener('submit', function(event) {
    // 1. Prevent the default behavior (page reload)
    event.preventDefault();

    // 2. Get values from the input fields
    const name = document.getElementById('name').value;
    const studentId = document.getElementById('studentId').value;
    const email = document.getElementById('email').value;
    const course = document.getElementById('course').value;

    // 3. Create a new table row element
    const newRow = document.createElement('tr');

    // 4. Set the inner HTML of the row (creating the cells)
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${studentId}</td>
        <td>${email}</td>
        <td>${course}</td>
    `;

    // 5. Append the new row to the table body
    tableBody.appendChild(newRow);

    // 6. Clear the form fields for the next entry
    form.reset();
});