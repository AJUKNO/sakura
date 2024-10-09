/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Interface representing a logging utility with various levels of logging.
 *
 * This interface defines methods for logging messages with different severity levels
 * (debug, info, warning, error), as well as methods for timing operations.
 *
 * @interface
 */
export interface Logger {
  /**
   * Logs a debug message.
   *
   * @param message - The message to log.
   * @param args - Optional additional arguments to include with the message.
   * @returns {void}
   */
  d(message: string, ...args: any[]): void;

  /**
   * Logs an informational message.
   *
   * @param message - The message to log.
   * @param args - Optional additional arguments to include with the message.
   * @returns {void}
   */
  i(message: string, ...args: any[]): void;

  /**
   * Logs a warning message.
   *
   * @param message - The message to log.
   * @param args - Optional additional arguments to include with the message.
   * @returns {void}
   */
  w(message: string, ...args: any[]): void;

  /**
   * Logs an error message.
   *
   * @param message - The message to log.
   * @param args - Optional additional arguments to include with the message.
   * @returns {void}
   */
  e(message: string, ...args: any[]): void;

  /**
   * Starts a timer with a given label for measuring elapsed time.
   *
   * @param label - The label to identify the timer.
   * @returns {void}
   */
  time(label: string): void;

  /**
   * Stops the timer with the given label and logs the elapsed time.
   *
   * @param label - The label identifying the timer to stop.
   * @returns {void}
   */
  timeEnd(label: string): void;
}

/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Options for configuring a logger.
 *
 * This interface allows customization of the logging behavior by providing options
 * such as adding a prefix to log messages, using colors, and including timestamps.
 *
 * @interface
 */
export interface LoggerOptions {
  /**
   * Optional prefix to prepend to each log message.
   *
   * If provided, this prefix will be added to the beginning of each log message.
   *
   * @type {string}
   */
  prefix?: string;

  /**
   * Optional flag to use colors in log output.
   *
   * If `true`, the logger will use colors in the log output to enhance readability.
   *
   * @type {boolean}
   */
  useColors?: boolean;

  /**
   * Optional flag to include timestamps in log messages.
   *
   * If `true`, each log message will include a timestamp indicating when the message was logged.
   *
   * @type {boolean}
   */
  includeTimestamp?: boolean;
}
