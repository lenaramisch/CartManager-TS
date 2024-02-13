-- +migrate Up

INSERT INTO items (price, name) VALUES 
(3.00, 'Smoothie'),
(0.50, 'Apple'),
(0.50, 'Banana'),
(5.50, 'Steak');
