import { LogLevel } from "./log-level";
import { LogConfig } from "./log-config";

export const DEFAULT_LOG_CONFIG: Required<LogConfig> = {
  logLevel: LogLevel.Info,
  enabled: true,
};
