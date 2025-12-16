/* --- GLOBAL DOM ELEMENTS --- */
const form = document.getElementById('studentForm');
const tableBody = document.getElementById('studentTableBody');
const submitBtn = document.getElementById('submitBtn');
const editIndexInput = document.getElementById('editIndex');
const countValue = document.getElementById('countValue');
const emptyMsg = document.getElementById('emptyMsg');

// Load Data when the page starts
document.addEventListener('DOMContentLoaded', loadStudents);

/* --- MAIN FORM SUBMISSION LOGIC --- */
form.addEventListener('submit', function(e) {
    // Prevent the page from refreshing
    e.preventDefault();

    // 1. Capture Values and trim whitespace
    const name = document.getElementById('name').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const course = document.getElementById('course').value;
    const editIndex = parseInt(editIndexInput.value);

    // 2. Load Existing Data from LocalStorage
    const students = getStudents();

    /* --- VALIDATION SECTION START --- */

    // A. Check for Empty Fields
    if (!name || !studentId || !email || !contact || !course) {
        showToast("FILL ALL DATA FIELDS REQUIRED.", "error");
        return;
    }

    // B. Validate Name: Alphabets only (Regular Expression)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        showToast("NAME MUST CONTAIN ALPHABETS ONLY.", "error");
        return;
    }
    // Check for at least 3 words (First, Middle, Last)
    const nameParts = name.split(/\s+/).filter(part => part.length > 0);
    if (nameParts.length < 3) {
        showToast("ENTER FIRST, MIDDLE, AND LAST NAME.", "error");
        return;
    }

    // C. Validate Numbers: Regex checks if string contains only digits
    const numberRegex = /^\d+$/;
    if (!numberRegex.test(studentId)) { showToast("ID MUST BE NUMERIC ONLY.", "error"); return; }
    if (!numberRegex.test(contact)) { showToast("CONTACT MUST BE NUMERIC ONLY.", "error"); return; }
    
    // D. Validate Contact Length (Exactly 10)
    if (contact.length !== 10) {
        showToast("CONTACT MUST BE EXACTLY 10 DIGITS.", "error");
        return;
    }

    // E. Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast("ENTER A VALID EMAIL ADDRESS.", "error");
        return;
    }

    // F. Uniqueness Check (Don't allow duplicate IDs, Emails, or Phones)
    // We filter out the current user if we are in 'Edit Mode'
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
    
    /* --- VALIDATION SECTION END --- */

    // Create the student object
    const studentData = { name, studentId, email, contact, course };

    // 3. Save Data (Add or Update)
    if (editIndex === -1) {
        // Mode: Add New
        students.push(studentData);
        showToast("NEW DATA FRAGMENT INITIALIZED.", "success");
    } else {
        // Mode: Update Existing
        students[editIndex] = studentData;
        showToast("DATA FRAGMENT UPDATED SUCCESSFULLY.", "success");
        resetFormState(); // Reset button text back to "Initialize"
    }

    // Save to Browser Storage
    localStorage.setItem('students', JSON.stringify(students));
    
    // Clear form and reload table
    form.reset();
    loadStudents();
});

/* --- CORE FUNCTIONS --- */

// Function: Renders the table rows based on stored data
function loadStudents() {
    const students = getStudents();
    tableBody.innerHTML = ''; // Clear current table
    countValue.textContent = students.length; // Update total count

    if (students.length === 0) {
        emptyMsg.classList.remove('hidden'); // Show "No Data" message
    } else {
        emptyMsg.classList.add('hidden');
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.className = "table-row-anim group"; // Apply animations
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

// Function: Populate form with existing data for editing
window.editStudent = function(index) {
    const students = getStudents();
    const s = students[index];

    // Fill inputs
    document.getElementById('name').value = s.name;
    document.getElementById('studentId').value = s.studentId;
    document.getElementById('email').value = s.email;
    document.getElementById('contact').value = s.contact;
    document.getElementById('course').value = s.course;

    editIndexInput.value = index; // Set the hidden index
    
    // Change Button Visuals to "Update"
    const btnSpan = submitBtn.querySelector('span');
    btnSpan.innerHTML = '<i class="fas fa-sync-alt animate-spin-slow"></i> UPDATE DATA';
    submitBtn.querySelector('div').classList.replace('from-cyan-600', 'from-yellow-600');
    submitBtn.querySelector('div').classList.replace('to-blue-600', 'to-orange-600');
    submitBtn.classList.add('shadow-yellow-500/20', 'hover:shadow-yellow-500/40');
    
    // Scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function: Delete a student
window.deleteStudent = function(index) {
    if(confirm("WARNING: Confirm Deletion of Data Fragment? This action is irreversible.")) {
        let students = getStudents();
        students.splice(index, 1); // Remove 1 item at index
        localStorage.setItem('students', JSON.stringify(students));
        loadStudents();
        
        // If we were editing the one we deleted, reset the form
        if (editIndexInput.value == index) resetFormState();
        showToast("FRAGMENT DELETED.", "error");
    }
}

// Function: Reset form back to "Add" mode
function resetFormState() {
    form.reset();
    editIndexInput.value = "-1";
    const btnSpan = submitBtn.querySelector('span');
    btnSpan.innerHTML = '<i class="fas fa-plus"></i> INITIALIZE';
    submitBtn.querySelector('div').classList.replace('from-yellow-600', 'from-cyan-600');
    submitBtn.querySelector('div').classList.replace('to-orange-600', 'to-blue-600');
    submitBtn.classList.remove('shadow-yellow-500/20', 'hover:shadow-yellow-500/40');
}

// Helper: Get data from LocalStorage safely
function getStudents() {
    return JSON.parse(localStorage.getItem('students')) || [];
}

// --- CUSTOM TOAST NOTIFICATION SYSTEM ---
// Displays colorful popup messages instead of boring alert()
function showToast(message, type) {
    const container = document.getElementById('notification-area');
    const toast = document.createElement('div');
    
    // Set colors based on success or error
    const colors = type === 'error' 
        ? 'border-red-500/50 bg-red-950/90 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
        : 'border-cyan-500/50 bg-cyan-950/90 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.4)]';

    const icon = type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check';

    // Build toast HTML
    toast.className = `flex items-center gap-4 px-5 py-4 rounded-xl border backdrop-blur-xl animate-slide-left ${colors} max-w-md`;
    toast.innerHTML = `
        <i class="fas ${icon} text-xl"></i> 
        <span class="text-sm font-['Orbitron'] tracking-wider font-bold">${message}</span>
    `;

    container.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)'; // Slide out
        toast.style.transition = 'all 0.5s ease-in';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}