CREATE DATABASE book_catalog;
CREATE USER book_catalog_manager WITH ENCRYPTED PASSWORD 'bookcatalog';
GRANT ALL PRIVILEGES ON DATABASE book_catalog TO book_catalog_manager;
