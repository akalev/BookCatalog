package ee.catalog.book.controller;

import ee.catalog.book.model.Book;
import ee.catalog.book.service.BookService;
import ee.catalog.book.util.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.List;

import static ee.catalog.book.common.Constants.*;
import static ee.catalog.book.util.MessageUtil.formatLog;

@RestController
@RequestMapping(ENDPOINT_BOOK)
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public List<Book> getAll() {
        String message = formatLog(HTTP_METHOD_GET, ENDPOINT_BOOK);
        Log.info(message);
        List<Book> books = bookService.getAll();
        Log.info(formatLog(message, Arrays.toString(books.toArray())));
        return books;
    }

    @PostMapping
    public Book create(@Valid Book book) {
        String message = formatLog(HTTP_METHOD_POST, ENDPOINT_BOOK);
        Log.info(message);
        Book bookFromDatabase = bookService.save(book);
        Log.info(formatLog(message, book.toString()));
        return bookFromDatabase;
    }

    @PutMapping
    public Book update(@Valid Book book) {
        String message = formatLog(HTTP_METHOD_PUT, ENDPOINT_BOOK);
        Log.info(message);
        Book bookFromDatabase = bookService.save(book);
        Log.info(formatLog(message, book.toString()));
        return bookFromDatabase;
    }

    @DeleteMapping
    public void delete(Book book) {
        String message = formatLog(HTTP_METHOD_DELETE, ENDPOINT_BOOK);
        Log.info(message);
        bookService.delete(book);
        Log.info(formatLog(message, book.toString()));
    }
}
