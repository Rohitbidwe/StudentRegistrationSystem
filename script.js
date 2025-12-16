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
        showToast("FILL ALL DATA FIELDS REQUIRED.", "error");
        return;
    }

    // B. Name Validation (Alphabets & 3 Words)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        showToast("NAME MUST CONTAIN ALPHABETS ONLY.", "error");
        return;
    }
    const nameParts = name.split(/\s+/).filter(part => part.length > 0);
    if (nameParts.length < 3) {
        showToast("ENTER FIRST, MIDDLE, AND LAST NAME.", "error");
        return;
    }

    // C. ID & Contact Validation (Numbers Only)
    const numberRegex = /^\d+$/;
    if (!numberRegex.test(studentId)) { showToast("ID MUST BE NUMERIC ONLY.", "error"); return; }
    if (!numberRegex.test(contact)) { showToast("CONTACT MUST BE NUMERIC ONLY.", "error"); return; }
    
    // D. Contact Length (Exactly 10)
    if (contact.length !== 10) {
        showToast("CONTACT MUST BE EXACTLY 10 DIGITS.", "error");
        return;
    }

    // E. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast("ENTER A VALID EMAIL ADDRESS.", "error");
        return;
    }

    // F. Uniqueness Check (ID, Email, Contact)
    const duplicateCheck = students.filter((_, index) => index !== editIndex);
    
    if (duplicateCheck.some(s => s.studentId === studentId)) {
        showToast(`ID ${studentId} ALREADY EXISTS!`, "error");
        return;
    }
    if (duplicateCheck.some(s => s.email.toLowerCase() === email.toLowerCase())) {
        showToast(`EMAIL ${email} ALREADY REGISTERED!`, "error");
        return;
    }
    if (duplicateCheck.some(s => s.contact === contact)) {
        showToast(`CONTACT ${contact} ALREADY REGISTERED!`, "error");
        return;
    }
    
    // --- VALIDATION END ---

    const studentData = { name, studentId, email, contact, course };

    // 3. Save Data
    if (editIndex === -1) {
        students.push(studentData);
        showToast("NEW DATA FRAGMENT INITIALIZED.", "success");
    } else {
        students[editIndex] = studentData;
        showToast("DATA FRAGMENT UPDATED SUCCESSFULLY.", "success");
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
            row.className = "table-row-anim group";
            row.innerHTML = `
                <td class="p-4 rounded-l-xl">
                    <div class="font-bold text-white tracking-wider font-['Orbitron']">${student.name}</div>
                    <div class="text-xs text-cyan-300/70 tracking-wider">${student.email}</div>
                </td>
                <td class="p-4">
                    <div class="font-mono text-cyan-400 text-sm tracking-widest">ID: ${student.studentId}</div>
                    <div class="font-mono text-cyan-300/70 text-xs tracking-widest">Ph: ${student.contact}</div>
                </td>
                <td class="p-4">
                    <span class="bg-gray-900/80 border border-cyan-500/30 text-cyan-300 text-xs px-3 py-1.5 rounded-lg shadow-sm shadow-cyan-500/10 tracking-wider font-bold">
                        ${student.course}
                    </span>
                </td>
                <td class="p-4 rounded-r-xl text-center">
                    <button onclick="editStudent(${index})" class="text-cyan-400 hover:text-yellow-400 transition mx-1 p-3 hover:bg-yellow-400/10 rounded-xl" title="Edit Fragment">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button onclick="deleteStudent(${index})" class="text-cyan-400 hover:text-red-500 transition mx-1 p-3 hover:bg-red-500/10 rounded-xl" title="Delete Fragment">
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
    submitBtn.querySelector('div').classList.replace('from-cyan-600', 'from-yellow-600');
    submitBtn.querySelector('div').classList.replace('to-blue-600', 'to-orange-600');
    submitBtn.classList.add('shadow-yellow-500/20', 'hover:shadow-yellow-500/40');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.deleteStudent = function(index) {
    // Custom futuristic confirm dialog could be added here, using native for now
    if(confirm("WARNING: Confirm Deletion of Data Fragment? This action is irreversible.")) {
        let students = getStudents();
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        loadStudents();
        if (editIndexInput.value == index) resetFormState();
        showToast("FRAGMENT DELETED.", "error");
    }
}

function resetFormState() {
    form.reset();
    editIndexInput.value = "-1";
    const btnSpan = submitBtn.querySelector('span');
    btnSpan.innerHTML = '<i class="fas fa-plus"></i> INITIALIZE';
    submitBtn.querySelector('div').classList.replace('from-yellow-600', 'from-cyan-600');
    submitBtn.querySelector('div').classList.replace('to-orange-600', 'to-blue-600');
    submitBtn.classList.remove('shadow-yellow-500/20', 'hover:shadow-yellow-500/40');
}

function getStudents() {
    return JSON.parse(localStorage.getItem('students')) || [];
}

// --- Custom "Futuristic" Toast Notification ---
function showToast(message, type) {
    const container = document.getElementById('notification-area');
    const toast = document.createElement('div');
    
    const colors = type === 'error' 
        ? 'border-red-500/50 bg-red-950/90 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
        : 'border-cyan-500/50 bg-cyan-950/90 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.4)]';

    const icon = type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check';

    toast.className = `flex items-center gap-4 px-5 py-4 rounded-xl border backdrop-blur-xl animate-slide-left ${colors} max-w-md`;
    toast.innerHTML = `
        <i class="fas ${icon} text-xl"></i> 
        <span class="text-sm font-['Orbitron'] tracking-wider font-bold">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.5s ease-in';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}