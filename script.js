// DOM Elements
const form = document.getElementById('studentForm');
const tableBody = document.getElementById('studentTableBody');
const submitBtn = document.getElementById('submitBtn');
const editIndexInput = document.getElementById('editIndex');
const countValue = document.getElementById('countValue');
const emptyMsg = document.getElementById('emptyMsg');

// Load Data
document.addEventListener('DOMContentLoaded', loadStudents);

// --- Form Submission ---
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Capture Values
    const name = document.getElementById('name').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const course = document.getElementById('course').value;
    const editIndex = parseInt(editIndexInput.value);

    // 2. Load Existing Data
    const students = getStudents();

    // --- VALIDATION START ---

    // A. Empty Fields
    if (!name || !studentId || !email || !contact || !course) {
        showToast("Fill all data fields required.", "error");
        return;
    }

    // B. Full Name (3 Words)
    const nameParts = name.split(/\s+/); // Split by spaces
    if (nameParts.length < 3) {
        showToast("Enter First, Middle, and Last name.", "error");
        return;
    }

    // C. Data Types
    if (isNaN(studentId)) { showToast("ID must be numeric.", "error"); return; }
    if (isNaN(contact)) { showToast("Contact must be numeric.", "error"); return; }
    
    // D. Contact Length (Exactly 10)
    if (contact.length !== 10) {
        showToast("Contact must be exactly 10 digits.", "error");
        return;
    }

    // E. Uniqueness Check (ID, Email, Contact)
    // We filter out the current student if we are in Edit Mode to allow saving without changing unique fields
    const duplicateCheck = students.filter((_, index) => index !== editIndex);
    
    if (duplicateCheck.some(s => s.studentId === studentId)) {
        showToast(`Student ID ${studentId} already exists!`, "error");
        return;
    }
    if (duplicateCheck.some(s => s.email === email)) {
        showToast(`Email ${email} is already registered!`, "error");
        return;
    }
    if (duplicateCheck.some(s => s.contact === contact)) {
        showToast(`Contact ${contact} is already registered!`, "error");
        return;
    }
    
    // --- VALIDATION END ---

    const studentData = { name, studentId, email, contact, course };

    // 3. Save Data
    if (editIndex === -1) {
        // Add
        students.push(studentData);
        showToast("New Data Fragment Added.", "success");
    } else {
        // Update
        students[editIndex] = studentData;
        showToast("Data Fragment Updated.", "success");
        resetFormState();
    }

    localStorage.setItem('students', JSON.stringify(students));
    form.reset();
    loadStudents();
});

// --- Core Functions ---

function loadStudents() {
    const students = getStudents();
    tableBody.innerHTML = '';
    countValue.textContent = students.length;

    if (students.length === 0) {
        emptyMsg.classList.remove('hidden');
    } else {
        emptyMsg.classList.add('hidden');
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.className = "table-row-anim group border-b border-gray-800 last:border-0";
            row.innerHTML = `
                <td class="p-4 rounded-l-lg">
                    <div class="font-bold text-white">${student.name}</div>
                    <div class="text-xs text-gray-500">${student.email}</div>
                </td>
                <td class="p-4">
                    <div class="font-mono text-blue-400 text-sm">ID: ${student.studentId}</div>
                    <div class="font-mono text-gray-500 text-xs">Ph: ${student.contact}</div>
                </td>
                <td class="p-4">
                    <span class="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-2 py-1 rounded shadow-inner">
                        ${student.course}
                    </span>
                </td>
                <td class="p-4 rounded-r-lg text-center">
                    <button onclick="editStudent(${index})" class="text-gray-400 hover:text-yellow-400 transition mx-1 p-2 hover:bg-yellow-400/10 rounded-full">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button onclick="deleteStudent(${index})" class="text-gray-400 hover:text-red-500 transition mx-1 p-2 hover:bg-red-500/10 rounded-full">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

window.editStudent = function(index) {
    const students = getStudents();
    const s = students[index];

    document.getElementById('name').value = s.name;
    document.getElementById('studentId').value = s.studentId;
    document.getElementById('email').value = s.email;
    document.getElementById('contact').value = s.contact;
    document.getElementById('course').value = s.course;

    editIndexInput.value = index;
    
    // UI Change
    const btnSpan = submitBtn.querySelector('span');
    btnSpan.innerHTML = '<i class="fas fa-sync-alt animate-spin-slow"></i> UPDATE DATA';
    submitBtn.querySelector('div').classList.add('from-yellow-600', 'to-orange-600');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.deleteStudent = function(index) {
    if(confirm("Confirm Deletion of Data Fragment?")) {
        let students = getStudents();
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        loadStudents();
        if (editIndexInput.value == index) resetFormState();
        showToast("Fragment Deleted.", "error");
    }
}

function resetFormState() {
    form.reset();
    editIndexInput.value = "-1";
    const btnSpan = submitBtn.querySelector('span');
    btnSpan.innerHTML = '<i class="fas fa-plus"></i> INITIALIZE';
    submitBtn.querySelector('div').classList.remove('from-yellow-600', 'to-orange-600');
}

function getStudents() {
    return JSON.parse(localStorage.getItem('students')) || [];
}

// --- Custom "Futuristic" Toast Notification ---
function showToast(message, type) {
    const container = document.getElementById('notification-area');
    const toast = document.createElement('div');
    
    // Colors based on type
    const colors = type === 'error' 
        ? 'border-red-500/50 bg-red-900/80 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
        : 'border-green-500/50 bg-green-900/80 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.4)]';

    const icon = type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle';

    toast.className = `flex items-center gap-3 px-4 py-3 rounded border backdrop-blur-md animate-slide-left ${colors}`;
    toast.innerHTML = `<i class="fas ${icon}"></i> <span class="text-sm font-['Orbitron']">${message}</span>`;

    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}