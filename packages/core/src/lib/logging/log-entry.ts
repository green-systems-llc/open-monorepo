import { LogLevel } from './log-level';

export interface LogEntry {
  level: LogLevel;
  timestamp: Date;
  message: string;
  error?: Error;
  group?: string;
}
