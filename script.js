// DOM Elements
const form = document.getElementById('studentForm');
const tableBody = document.getElementById('studentTableBody');
const submitBtn = document.getElementById('submitBtn');
const editIndexInput = document.getElementById('editIndex');
const totalCountSpan = document.getElementById('totalCount');
const emptyMsg = document.getElementById('emptyMsg');

// Load data on start
document.addEventListener('DOMContentLoaded', loadStudents);

// Form Submit Event
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get Values
    const name = document.getElementById('name').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const course = document.getElementById('course').value;
    const editIndex = parseInt(editIndexInput.value);

    // --- VALIDATION START ---
    if (!name || !studentId || !email || !contact || !course) {
        alert("Please fill in all fields.");
        return;
    }

    if (isNaN(studentId)) {
        alert("Student ID must be a number.");
        return;
    }

    // Contact Validation: Must be number and exactly 10 digits
    if (contact.length !== 10 || isNaN(contact)) {
        alert("Contact number must be exactly 10 digits.");
        return;
    }

    // Email Basic Validation
    if (!email.includes('@') || !email.includes('.')) {
        alert("Please enter a valid email.");
        return;
    }
    // --- VALIDATION END ---

    // Create Object
    const studentData = { name, studentId, email, contact, course };
    let students = getStudentsFromStorage();

    if (editIndex === -1) {
        // ADD MODE: Check for duplicate ID
        if (students.some(s => s.studentId === studentId)) {
            alert("Student ID already exists!");
            return;
        }
        students.push(studentData);
    } else {
        // EDIT MODE: Update existing index
        students[editIndex] = studentData;
        // Reset mode
        editIndexInput.value = "-1";
        submitBtn.innerHTML = '<i class="fas fa-plus-circle"></i> <span>Add Student</span>';
        submitBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
        submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    }

    localStorage.setItem('students', JSON.stringify(students));
    form.reset();
    loadStudents(); // Re-render table
});

// Load Students from Storage
function loadStudents() {
    const students = getStudentsFromStorage();
    tableBody.innerHTML = '';

    if (students.length === 0) {
        emptyMsg.classList.remove('hidden');
    } else {
        emptyMsg.classList.add('hidden');
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.className = "hover:bg-gray-50 transition";
            row.innerHTML = `
                <td class="p-3 text-gray-700 font-medium">${student.name}</td>
                <td class="p-3 text-gray-600">${student.studentId}</td>
                <td class="p-3 text-gray-600">${student.contact}</td>
                <td class="p-3"><span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${student.course}</span></td>
                <td class="p-3 text-center space-x-2">
                    <button onclick="editStudent(${index})" class="text-yellow-500 hover:text-yellow-700 transition" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteStudent(${index})" class="text-red-500 hover:text-red-700 transition" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    totalCountSpan.textContent = `Total: ${students.length}`;
}

// Edit Student
window.editStudent = function(index) {
    const students = getStudentsFromStorage();
    const student = students[index];

    // Populate Form
    document.getElementById('name').value = student.name;
    document.getElementById('studentId').value = student.studentId;
    document.getElementById('email').value = student.email;
    document.getElementById('contact').value = student.contact;
    document.getElementById('course').value = student.course;

    // Set Edit Mode
    editIndexInput.value = index;
    
    // Change Button Visuals
    submitBtn.innerHTML = '<i class="fas fa-save"></i> <span>Update Student</span>';
    submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
    submitBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
}

// Delete Student
window.deleteStudent = function(index) {
    if(confirm("Are you sure you want to delete this student?")) {
        let students = getStudentsFromStorage();
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        loadStudents();
        
        // If we were editing this specific user, reset the form
        if (editIndexInput.value == index) {
            form.reset();
            editIndexInput.value = "-1";
            submitBtn.innerHTML = '<i class="fas fa-plus-circle"></i> <span>Add Student</span>';
            submitBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
            submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');
        }
    }
}

// Helper: Get from Storage
function getStudentsFromStorage() {
    return JSON.parse(localStorage.getItem('students')) || [];
}