package ee.catalog.book.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.persistence.GenerationType;
import javax.validation.constraints.NotEmpty;
import java.util.Date;

@Data
@Entity
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotEmpty
    private String title;

    @NotEmpty
    private String author;
    private Integer year;

    @JsonIgnore
    private Date deleted;
}
