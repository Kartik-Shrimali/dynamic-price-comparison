CREATE DATABASE dbms_project;
USE dbms_project;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    category VARCHAR(100)
);

CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    rating DECIMAL(3,2) CHECK (rating BETWEEN 0 AND 5),
    delivery_time_days INT
);

CREATE TABLE prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    store_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE (product_id, store_id)
);

CREATE TABLE availability (
    store_id INT NOT NULL,
    product_id INT NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (store_id, product_id),
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    price_id INT NOT NULL,
    old_price DECIMAL(10,2) NOT NULL CHECK (old_price >= 0),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (price_id) REFERENCES prices(id) ON DELETE CASCADE
);

CREATE TABLE user_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    max_payable_amount DECIMAL(10,2) NOT NULL CHECK (max_payable_amount >= 0),
    notification_enabled BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

/*TRIGGER */

DELIMITER $$

CREATE TRIGGER before_price_update
BEFORE UPDATE ON prices
FOR EACH ROW
BEGIN
    INSERT INTO price_history (price_id, old_price) VALUES (OLD.id, OLD.price);
END$$

CREATE TRIGGER notify_user_alerts
AFTER UPDATE ON prices
FOR EACH ROW
BEGIN
    INSERT INTO user_alerts (user_id, product_id, max_payable_amount, notification_enabled)
    SELECT user_alerts.user_id, user_alerts.product_id, user_alerts.max_payable_amount, TRUE
    FROM user_alerts
    WHERE user_alerts.product_id = NEW.product_id AND NEW.price <= user_alerts.max_payable_amount;
END$$

DELIMITER ;

/*DUMMY DATA */

USE price_comparison;

INSERT INTO users (name, email, password) VALUES
('Kartik', 'kartikshrimali62@gmail.com', '12345'),
('Karan', 'karan@gmail.com', '12345'),
('Kranti', 'kranti@gmail.com', '12345'),
('Madhav', 'madhav@gmail.com', '12345');

INSERT INTO products (name, brand, category) VALUES
('Laptop', 'Dell', 'Electronics'),
('Phone', 'Samsung', 'Electronics'),
('Tablet', 'Apple', 'Electronics'),
('Headphones', 'Sony', 'Accessories');

INSERT INTO stores (name, rating, delivery_time_days) VALUES
('Amazon', 4.5, 3),
('Flipkart', 4.3, 2),
('Snapdeal', 3.8, 5),
('Croma', 4.2, 4);

INSERT INTO prices (product_id, store_id, price) VALUES
(1, 1, 55000),
(1, 2, 54000),
(2, 3, 25000),
(3, 4, 60000);

INSERT INTO availability (store_id, product_id, available) VALUES
(1, 1, TRUE),
(2, 1, TRUE),
(3, 2, FALSE),
(4, 3, TRUE);