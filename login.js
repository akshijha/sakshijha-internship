const loginForm = document.getElementById("loginForm");
const loginErrorMessage = document.getElementById("loginErrorMessage");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get input values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate email and password
    if (!email || !password) {
        loginErrorMessage.textContent = "Please fill in all fields.";
        return;
    }

    try {
        // Send login request to the server
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            // Redirect on successful login
            window.location.href = "/dashboard.html";
        } else {
            // Display error message from server
            loginErrorMessage.textContent = result.message || "Login failed.";
        }
    } catch (error) {
        console.error("Error logging in:", error);
        loginErrorMessage.textContent = "An error occurred. Please try again.";
    }
});
