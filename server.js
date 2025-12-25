const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

app.get("/", (req, res) => {
    res.send("Vehicle Rental Backend Running 🚗");
});


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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server started");
});
