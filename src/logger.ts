import winston, {format, level, Logger as WinstonLogger} from "winston";


export class Logger {
    private static instance: WinstonLogger;

    private static getInstance(): WinstonLogger {
        const defaultOptions = {
            format: format.combine(
                format.simple()
            ),
            level: "info",
            colorize: true,
            timestamp: true,
            json: false
        };
        if (!Logger.instance) {
            this.instance = winston.createLogger({
                transports: [new winston.transports.Console(defaultOptions)],
                exitOnError: true
            });
        }
        return Logger.instance
    }

    public static warn(message: any, ...meta: any[]): void {
        console.log(this.getInstance() == null)
        this.getInstance().log("warn", message, meta)
    }

    public static error(message: any, ...meta: any[]): void {
        this.getInstance().log("error", message, meta)
    }

    public static info(message: any, ...meta: any[]): void {
        this.getInstance().log("info", message, meta)
    }
}