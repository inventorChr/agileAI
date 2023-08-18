const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = express.Router();

const saltRounds = 10;
login.post('/', async (req, res) => {
    const { username, password } = req.body;
    const User = req.db.models.User;

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            res.status(401).json({ error: 'Invalid username or password' });
        } else {
            // Compare the provided password with the stored hash
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                res.status(401).json({ error: 'Invalid username or password' });
            } else {
                // Generate a token for the user
                const token = jwt.sign({ userId: user.id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
                res.json({ message: 'Logged in successfully', token });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

// Register new user
login.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const User = req.db.models.User;

    try {
        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            username: username,
            password: hashedPassword
        });

        // Send back the new user's data, excluding the password
        res.json({ username: newUser.username, id: newUser.id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
});


module.exports = login;
