const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
let dbPool;

try {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not defined');
    }

    // Parse the connection string to ensure SSL works correctly with Aiven
    const dbUrl = new URL(process.env.DATABASE_URL);
    
    dbPool = mysql.createPool({
        host: dbUrl.hostname,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1), // Removes the leading '/'
        port: dbUrl.port,
        ssl: {
            rejectUnauthorized: false // Required for Aiven free tier
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log("Database pool created successfully");

} catch (error) {
    console.error("Database Connection Failed:", error.message);
}

// Root Route
app.get("/", (req, res) => {
    res.send("Vehicle Rental Backend Running 🚗");
});

// API Route
app.post('/api/rental', async (req, res) => {
    try {
        if (!dbPool) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const { full_name, email, license_number, vehicle_type, rental_start, rental_end, phone, additional_info, terms } = req.body;

        if (!full_name || !email || !license_number || !vehicle_type || !rental_start || !rental_end || !terms) {
            return res.status(400).json({ error: 'All required fields must be filled' });
        }

        // Use the global pool (dbPool)
        const [result] = await dbPool.execute(
            `INSERT INTO rentals (full_name, email, license_number, vehicle_type, rental_start, rental_end, phone, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [full_name, email, license_number, vehicle_type, rental_start, rental_end, phone || null, additional_info || null]
        );

        res.status(201).json({ message: 'Rental request submitted successfully', id: result.insertId });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to submit rental request' });
    }
});

// --- LOCAL TESTING SUPPORT ---
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}

// Export for Vercel
module.exports = app;