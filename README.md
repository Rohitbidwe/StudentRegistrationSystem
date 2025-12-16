# Nexus Student Portal (Phase 11 Refined)

A futuristic, cyberpunk-themed Student Management System built with semantic HTML, Tailwind CSS, and pure JavaScript.

## 🌌 Visual Features
- **Glassmorphism UI:** Translucent panels with backdrop blur.
- **Neon Aesthetics:** Glowing inputs, animated gradients, and pulse effects.
- **Custom Notifications:** Replaced default alerts with animated toast popups.

## 🛡️ Advanced Validation Logic
1.  **Unique Constraints:**
    - Checks database to ensure **Student ID**, **Email**, and **Contact No** are not repeated.
    - Logic adapts during "Edit Mode" to ignore the current user's own data.
2.  **Name Formatting:**
    - Enforces a 3-word minimum (First, Middle, Last) using RegEx splitting.
3.  **Data Integrity:**
    - Contact number must be exactly 10 digits.
    - Prevents empty or partial submissions.

## 🚀 Tech Stack
- **Styling:** Tailwind CSS (CDN) + Custom Animations (`style.css`).
- **Icons:** Font Awesome 6.
- **Fonts:** Orbitron (Headers) & Poppins (Body).
- **Storage:** LocalStorage API for persistent data.

## 🔧 How to Run
1.  Clone the repository.
2.  Open `index.html` in any modern browser.
3.  Enjoy the experience!