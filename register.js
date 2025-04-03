// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCahNKTDKLJUx-yCtifdc1U0ydyjPuin3o",
  authDomain: "quizwiz-14097.firebaseapp.com",
  projectId: "quizwiz-14097",
  storageBucket: "quizwiz-14097.firebasestorage.app",
  messagingSenderId: "733796947024",
  appId: "1:733796947024:web:4e8fb7b5f06cabf575ed55",
  measurementId: "G-WS544Z1S17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const toggleButtons = document.querySelectorAll('.toggle-password');

    // Password visibility toggle
    toggleButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const input = passwordInputs[index];
            if (input.type === 'password') {
                input.type = 'text';
                button.classList.remove('fa-eye');
                button.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                button.classList.remove('fa-eye-slash');
                button.classList.add('fa-eye');
            }
        });
    });

    // Form validation and submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const role = document.getElementById('signup-role').value;
        const termsAccepted = document.getElementById('terms-conditions').checked;

        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (!termsAccepted) {
            alert('Please accept the Terms & Conditions!');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long!');
            return;
        }

        try {
            // Show loading state
            const submitButton = document.querySelector('.btn-submit');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Signing up...';
            submitButton.disabled = true;

            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Here you can add additional user data to Firestore if needed
            console.log('User registered successfully:', user);

            // Show success message and redirect
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.textContent = 'Registration successful! Redirecting to login...';
            signupForm.insertBefore(successMessage, submitButton);

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-error';
            errorMessage.textContent = error.message || 'An error occurred during registration. Please try again.';
            signupForm.insertBefore(errorMessage, submitButton);

            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;

            // Remove error message after 5 seconds
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        }
    });

    // Social login handlers
    const socialButtons = document.querySelectorAll('.social-icon');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.classList[1]; // google, facebook, or twitter
            console.log(`${platform} login clicked`);
            // Add your social login implementation here
        });
    });
});