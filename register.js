document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("signup-username").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("signup-confirm-password").value;
        const role = document.getElementById("signup-role").value;

        // Validate input fields
        if (!username || !email || !password || !confirmPassword || !role) {
            alert("All fields are required!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Prepare request payload
        const requestData = {
            email: email,
            password: password,
            role: role,
            name: username,
        };

        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Registration successful! Redirecting to login...");
                window.location.href = "login.html"; // Redirect user to login page
            } else {
                alert(result.error || "Registration failed!");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});
