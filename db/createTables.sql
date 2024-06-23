DROP TABLE IF EXISTS apartments;

CREATE TABLE apartments (
    id INTEGER PRIMARY KEY,
    bed INT NOT NULL,
    bath INT NOT NULL,
    cost INT NOT NULL,
    description TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    address VARCHAR(255),
    sqft INT,
    phone VARCHAR(255),
    email VARCHAR(255),
    url VARCHAR(255),
    image_urls TEXT,
    gender INT,
    shared INT,
    furnished INT,
    pets INT,
    parking INT,
    laundry INT
);