CREATE TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);
INSERT INTO blogs (author, url, title, likes) VALUES
('John Doe', 'https://example.com/blog1', 'First Blog Post', 10),
('Jane Smith', 'https://example.com/blog2', 'Second Blog Post', 20);