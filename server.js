const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
app.use(bodyParser.json());

// Simulated Database (Using Map for Efficient Lookups)
const users = new Map();

// Helper Functions
const isEmailRegistered = (email) => users.has(email);
const addUser = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = users.size + 1;
    users.set(email, { id: userId, name, email, password: hashedPassword });
    return userId;
};

// User Registration API
app.post("/users/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate Input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if email is already registered
        if (isEmailRegistered(email)) {
            return res.status(409).json({ message: "Email is already registered" });
        }

        // Add new user to the database
        const userId = await addUser(name, email, password);
        res.status(201).json({ message: "User registered successfully", userId });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
