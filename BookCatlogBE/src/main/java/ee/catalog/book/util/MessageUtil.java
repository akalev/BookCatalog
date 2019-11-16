package ee.catalog.book.util;

import static ee.catalog.book.common.Constants.PATTERN_LOG;
import static java.text.MessageFormat.format;

public class MessageUtil {

    public static String formatLog(String method, String message) {
        return format(PATTERN_LOG, method, message);
    }
}
