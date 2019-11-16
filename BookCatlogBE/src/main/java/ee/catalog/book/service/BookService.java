package ee.catalog.book.service;

import ee.catalog.book.model.Book;

import java.util.List;

public interface BookService {
    List<Book> getAll();
    Book save(Book book);
    void delete(Book book);
}
