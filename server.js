const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const mongoose = require('mongoose');


const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Mongo DB Connection
const uri = process.env.MONGO_URI;
if (!uri) {
    console.error("MONGO_URI is not defined in the environment variables.");
    process.exit(1);
}
const client = new MongoClient(uri);

let usersCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        const db = client.db("user_auth");
        usersCollection = db.collection("users");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

// Signup API
app.post("/signup", async (req, res) => {
    const { fullName, email, dob, phone, password, confirmPassword } = req.body;

    if (!fullName || !email || !dob || !phone || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await usersCollection.insertOne({
            fullName,
            email,
            dob,
            phone,
            password: hashedPassword,
        });

        res.status(201).json({ message: "Account created successfully!" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

// Login API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html')); // Welcome page
});



// Graceful Shutdown
process.on("SIGINT", async () => {
    await client.close();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
});

// Define User Schema
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    dob: Date,
    phone: String,
    password: String,
});

// User Model
const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/signup', async (req, res) => {
    const { fullName, email, dob, phone, password, confirmPassword } = req.body;

    // Validate passwords
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const newUser = new User({
            fullName,
            email,
            dob,
            phone,
            password: hashedPassword,
        });
         k

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving user to database' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});