CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    bio TEXT,
    profile_photo_url VARCHAR(255),
    instagram_username VARCHAR(255),
    countries_visited INTEGER DEFAULT 0,
    cities_visited INTEGER DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE trips (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    number_of_travelers INTEGER,
    trip_type VARCHAR(50),
    travel_mode VARCHAR(50),
    cover_image_url VARCHAR(255),
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE trip_days (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL REFERENCES trips(id),
    day_number INTEGER,
    date DATE,
    location VARCHAR(255),
    notes TEXT
);

CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    trip_day_id BIGINT NOT NULL REFERENCES trip_days(id),
    name VARCHAR(255) NOT NULL,
    time VARCHAR(50),
    location_name VARCHAR(255),
    google_maps_url VARCHAR(255),
    description TEXT,
    duration_minutes INTEGER,
    estimated_cost NUMERIC(10,2),
    best_time VARCHAR(100),
    notes TEXT,
    sort_order INTEGER
);

CREATE TABLE hotels (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL REFERENCES trips(id),
    hotel_name VARCHAR(255),
    location VARCHAR(255),
    check_in DATE,
    check_out DATE,
    price_per_night NUMERIC(10,2),
    booking_url VARCHAR(255),
    google_maps_url VARCHAR(255),
    notes TEXT
);

CREATE TABLE restaurants (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL REFERENCES trips(id),
    restaurant_name VARCHAR(255),
    location VARCHAR(255),
    meal VARCHAR(50),
    price_range VARCHAR(10),
    google_maps_url VARCHAR(255),
    notes TEXT
);

CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL REFERENCES trips(id),
    category VARCHAR(50),
    description VARCHAR(255),
    amount NUMERIC(10,2),
    date DATE,
    notes TEXT
);
