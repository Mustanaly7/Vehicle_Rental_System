CREATE TABLE IF NOT EXISTS rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    vehicle_type ENUM('sedan', 'suv', 'truck', 'van', 'sports-car') NOT NULL,
    rental_start DATE NOT NULL,
    rental_end DATE NOT NULL,
    phone VARCHAR(20),
    additional_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);