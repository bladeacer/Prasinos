CREATE SCHEMA prasinos;

CREATE USER 'prasinos_admin'@'localhost' IDENTIFIED BY 'stub_qwest67-aus';
GRANT ALL PRIVILEGES ON prasinos.* TO 'prasinos_admin'@'localhost';
