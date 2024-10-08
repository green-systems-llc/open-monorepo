// Local.
import { LogLevel } from "./log-level";
import { LogEntry } from "./log-entry";
import { LogConfig } from "./log-config";
import { DEFAULT_LOG_CONFIG } from "./logging.constants";

export interface InMemoryLogConfig extends LogConfig {
  storeLogs?: boolean;
  maxStoredLogCount?: number;
}

const DEFAULT_IN_MEMORY_LOG_CONFIG: Required<InMemoryLogConfig> = {
  ...DEFAULT_LOG_CONFIG,
  storeLogs: true,
  maxStoredLogCount: 250,
};

export class InMemoryLogger {
  readonly logs: LogEntry[] = [];
  protected readonly config: Required<InMemoryLogConfig>;

  constructor(config?: Partial<InMemoryLogConfig>) {
    this.config = { ...DEFAULT_IN_MEMORY_LOG_CONFIG, ...config };
  }

  log(level: LogLevel, message: string, error?: Error): void {
    const skip = this.config.enabled === false || level < this.config.logLevel;
    if (skip) {
      return;
    }

    const args: unknown[] = [message];
    if (error) {
      args.push(error);
    }

    if (this.config.storeLogs) {
      this.logs.push({ timestamp: new Date(), level, message, error });
    }

    if (this.logs.length > this.config.maxStoredLogCount) {
      this.logs.shift();
    }
  }

  trace(message: string): void {
    this.log(LogLevel.Trace, message);
  }

  debug(message: string): void {
    this.log(LogLevel.Debug, message);
  }

  info(message: string): void {
    this.log(LogLevel.Info, message);
  }

  warn(message: string, error?: Error): void {
    this.log(LogLevel.Warn, message, error);
  }

  error(message: string, error?: Error): void {
    this.log(LogLevel.Error, message, error);
  }

  fatal(message: string, error?: Error): void {
    this.log(LogLevel.Fatal, message, error);
  }
}
