import { describe, expect, it, vi } from 'vitest';
import Logger from '../src/utils/logger';

describe('Logger', () => {
  it('should log messages with DEBUG level', () => {
    const logger = new Logger();
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.d('Debug message');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('DEBUG: Debug message')
    );
    consoleLogSpy.mockRestore();
  });

  it('should log messages with INFO level', () => {
    const logger = new Logger();
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.i('Info message');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('INFO: Info message')
    );
    consoleLogSpy.mockRestore();
  });

  it('should log messages with ERROR level', () => {
    const logger = new Logger();
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.e('Error message');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('ERROR: Error message')
    );
    consoleLogSpy.mockRestore();
  });

  it('should log messages with WARN level', () => {
    const logger = new Logger();
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.w('Warning message');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('WARN: Warning message')
    );
    consoleLogSpy.mockRestore();
  });

  it('should format messages with prefix if option is set', () => {
    const logger = new Logger({ prefix: '[PREFIX]' });
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.d('Debug message with prefix');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('[PREFIX] DEBUG: Debug message with prefix')
    );
    consoleLogSpy.mockRestore();
  });
});
