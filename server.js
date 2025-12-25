const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'admin123', // Replace with your MySQL password
    database: 'vehicle_rental'
};

// Serve static files (e.g., index.html)
app.use(express.static('public'));

// API endpoint to handle form submission
app.post('/api/rental', async (req, res) => {
    try {
        const {
            full_name,
            email,
            license_number,
            vehicle_type,
            rental_start,
            rental_end,
            phone,
            additional_info,
            terms
        } = req.body;

        // Validate required fields
        if (!full_name || !email || !license_number || !vehicle_type || !rental_start || !rental_end || !terms) {
            return res.status(400).json({ error: 'All required fields must be filled' });
        }

        // Create a connection to the database
        const connection = await mysql.createConnection(dbConfig);

        // Insert data into the rentals table
        const [result] = await connection.execute(
            `INSERT INTO rentals (
                full_name, email, license_number, vehicle_type, 
                rental_start, rental_end, phone, additional_info
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                full_name,
                email,
                license_number,
                vehicle_type,
                rental_start,
                rental_end,
                phone || null,
                additional_info || null
            ]
        );

        await connection.end();

        res.status(201).json({ message: 'Rental request submitted successfully', id: result.insertId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to submit rental request' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});