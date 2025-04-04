import { loginUser, registerUser, logoutUser } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const studentLoginForm = document.getElementById('student-login-form');
    const facultyLoginForm = document.getElementById('faculty-login-form');
    const studentBtn = document.getElementById('student-btn');
    const facultyBtn = document.getElementById('faculty-btn');

    // Role switching functionality
    if (studentBtn && facultyBtn) {
        studentBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });

        facultyBtn.addEventListener('click', () => {
            window.location.href = 'faculty-login.html';
        });
    }

    // Handle student login form submission
    if (studentLoginForm) {
        const studentEmail = document.getElementById('student-email');
        const studentPassword = document.getElementById('student-password');

        studentLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('.btn-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            
            try {
                const result = await loginUser(studentEmail.value, studentPassword.value);
                if (result.success) {
                    window.location.href = 'student_home.html';
                } else {
                    showError('Login failed: ' + result.error);
                }
            } catch (error) {
                showError('An error occurred during login: ' + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login as Student';
            }
        });
    }

    // Handle faculty login form submission
    if (facultyLoginForm) {
        const facultyEmail = document.getElementById('faculty-email');
        const facultyPassword = document.getElementById('faculty-password');

        facultyLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('.btn-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';

            try {
                const result = await loginUser(facultyEmail.value, facultyPassword.value);
                if (result.success) {
                    window.location.href = 'faculty_home.html';
                } else {
                    showError('Login failed: ' + result.error);
                }
            } catch (error) {
                showError('An error occurred during login: ' + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login as Faculty';
            }
        });
    }

    // Toggle password visibility
    const togglePasswords = document.querySelectorAll('.toggle-password');
    togglePasswords.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input[type="password"]');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Helper function to show errors
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'red';
        errorDiv.style.marginBottom = '10px';
        errorDiv.style.textAlign = 'center';
        
        const form = document.querySelector('.active-form');
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
});
