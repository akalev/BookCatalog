package ee.catalog.book.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Log {

    private static Logger logger = LoggerFactory.getLogger(Log.class);

    public static void info(String message) {
        logger.info(message);
    }
}
