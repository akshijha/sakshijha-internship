document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        dob: document.getElementById('dob').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
    };

    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    const data = await response.json();
    const messageElement = document.getElementById('responseMessage');
    if (data.success) {
        messageElement.style.color = 'green';
    } else {
        messageElement.style.color = 'red';
    }
    messageElement.textContent = data.message;
});
const form = document.getElementById('signupForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach((msg) => (msg.textContent = ''));

    // Collect form data
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    // Validate inputs
    let isValid = true;

    // Full Name
    if (!fullName) {
        setError('fullName', 'Full name is required');
        isValid = false;
    }

    // Email
    if (!validateEmail(email)) {
        setError('email', 'Invalid email address');
        isValid = false;
    }

    

    // Phone Number
    if (!validatePhone(phone)) {
        setError('phone', 'Invalid phone number');
        isValid = false;
    }

    // Password
    if (password.length < 6) {
        setError('password', 'Password must be at least 6 characters');
        isValid = false;
    }

    // Confirm Password
    if (password !== confirmPassword) {
        setError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }

    // Submit if valid
    if (isValid) {
        alert('Form submitted successfully!');
        form.reset(); // Reset form fields
    }
});

// Helper Functions
function setError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorMessage = field.nextElementSibling;
    errorMessage.textContent = message;
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}




function validatePhone(phone) {
    const regex = /^\d{10}$/; // Accepts 10-digit numbers
    return regex.test(phone);
}

