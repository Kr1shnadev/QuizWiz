document.getElementById("student-login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("student-email").value;
    const password = document.getElementById("student-password").value;

    try {
        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem("authToken", data.token);

        // ✅ **Redirect based on role**
        if (data.redirect) {
            window.location.href = data.redirect;
        } else {
            alert("Invalid role!");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Error logging in.");
    }
});
