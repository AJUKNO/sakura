import { ILogger } from '@/types/interfaces'
import { SAKURA } from '@/utils/constants'

export class Logger implements ILogger {
  private readonly prefix: string

  constructor(prefix: string) {
    this.prefix = prefix
  }

  public d(message: string, ...data: unknown[]): void {
    console.log(this.formatMessage('36', message), ...data)
  }

  public i(message: string, ...data: unknown[]): void {
    console.info(this.formatMessage('35', message), ...data)
  }

  public e(message: string, ...data: unknown[]): void {
    console.error(this.formatMessage('31', message), ...data)
  }

  public w(message: string, ...data: unknown[]): void {
    console.warn(this.formatMessage('33', message), ...data)
  }

  public time(label: string): void {
    console.time(label)
  }

  public timeEnd(label: string): void {
    console.timeEnd(label)
  }

  private formatMessage(levelColor: string, message: string): string {
    return `\x1b[${levelColor}m${this.prefix}\x1b[0m ${message}`
  }
}

export const SakuraLogger = new Logger(SAKURA)
