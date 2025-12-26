CREATE TABLE rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    rental_start DATE NOT NULL,
    rental_end DATE NOT NULL,
    phone VARCHAR(20),
    additional_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);