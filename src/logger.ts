import winston, { format, Logger as WinstonLogger } from "winston";

export class Logger {
  private static instance: WinstonLogger;

  private static getInstance(): WinstonLogger {
    const defaultOptions = {
      format: format.combine(
        format.simple(),
      ),
      level: "info",
      colorize: true,
      timestamp: true,
      json: false,
    };
    if (!Logger.instance) {
      this.instance = winston.createLogger({
        transports: [ new winston.transports.Console(defaultOptions) ],
        exitOnError: true,
      });
    }
    return Logger.instance;
  }

  public static warn(message: string, ...meta: any[]): void {
    this.getInstance().log("warn", message, meta);
  }

  public static error(message: string, ...meta: any[]): void {
    this.getInstance().log("error", message, meta);
  }

  public static info(message: string, ...meta: any[]): void {
    this.getInstance().log("info", message, meta);
  }
}
