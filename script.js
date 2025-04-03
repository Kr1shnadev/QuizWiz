document.getElementById("student-login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("student-email").value;
    const password = document.getElementById("student-password").value;

    try {
        console.log("Sending login request:", { email, password });

        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        console.log("Response received:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Login Response:", data);

        if (data.token) { 
            alert("Login Successful!");
            localStorage.setItem("authToken", data.token);
            window.location.href = "faculty_home.html";
        } else {
            alert("Invalid Credentials");
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("Error connecting to server.");
    }
});
