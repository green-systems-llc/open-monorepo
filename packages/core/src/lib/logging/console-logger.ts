// Local.
import { LogLevel } from './log-level';
import { KeyValue } from '../object/key-value';
import { InMemoryLogConfig, InMemoryLogger } from './in-memory-logger';

export class ConsoleLogger extends InMemoryLogger {
  private readonly consoleMap: KeyValue<(...data: unknown[]) => void> = {};

  constructor(config?: InMemoryLogConfig) {
    super({ storeLogs: false, ...config });
    this.consoleMap[LogLevel.Trace] = console.trace;
    this.consoleMap[LogLevel.Debug] = console.debug;
    this.consoleMap[LogLevel.Info] = console.info;
    this.consoleMap[LogLevel.Warn] = console.warn;
    this.consoleMap[LogLevel.Error] = console.error;
    this.consoleMap[LogLevel.Fatal] = console.error;
  }

  override log(level: LogLevel, message: string, error?: Error): void {
    const skip = this.config.enabled === false || level < this.config.logLevel;
    if (skip) {
      return;
    }

    super.log(level, message, error);
    const args: unknown[] = [message];

    if (error) {
      args.push(error);
    }

    this.consoleMap[level].apply(console, args);
  }
}
