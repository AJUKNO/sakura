import { ILogger, ILoggerOptions } from '@/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Logger implements ILogger {
  private readonly options: ILoggerOptions;

  constructor(options?: ILoggerOptions) {
    this.options = {
      ...options,
    };
  }

  public d(message: string, ...data: any[]): void {
    this.log('36', 'DEBUG', message, data);
  }

  public i(message: string, ...data: any[]): void {
    this.log('35', 'INFO', message, data);
  }

  public e(message: string, ...data: any[]): void {
    this.log('31', 'ERROR', message, data);
  }

  public w(message: string, ...data: any[]): void {
    this.log('33', 'WARN', message, data);
  }

  public time(label: string): void {
    console.time(this.formatLabel(label));
  }

  public timeEnd(label: string): void {
    console.timeEnd(this.formatLabel(label));
  }

  private log(
    color: string,
    level: string,
    message: string,
    data: any[]
  ): void {
    const formattedMessage = this.formatMessage(color, level, message);
    if (data.length) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      console.log(formattedMessage, ...data);
    } else {
      console.log(formattedMessage);
    }
  }

  private formatMessage(
    levelColor: string,
    level: string,
    message: string
  ): string {
    const timestamp = this.options.includeTimestamp
      ? `[${this.getFormattedTimestamp()}] `
      : '';
    const colorPrefix = this.options.useColors ? `\x1b[${levelColor}m` : '';
    const colorSuffix = this.options.useColors ? `\x1b[0m` : '';
    const prefix = this.options.prefix ? `${this.options.prefix} ` : '';

    return `${timestamp}${colorPrefix}${prefix}${level}${colorSuffix}: ${message}`;
  }

  private formatLabel(label: string): string {
    const prefix = this.options.prefix ? `${this.options.prefix} ` : '';
    return `${prefix}${label}`;
  }

  private getFormattedTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year.toString()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
