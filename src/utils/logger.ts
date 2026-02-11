import { createLogger, format, transports } from 'winston'
import * as path from 'path'
import * as fs from 'fs'

const logDir = path.join(process.cwd(), 'logs')

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

/**
 * ===============================
 * In-Memory Log Buffer (Per Test)
 * ===============================
 */
class TestLogBuffer {
  private logs: string[] = []

  add(entry: string) {
    this.logs.push(entry)
  }

  getAll(): string {
    return this.logs.join('\n')
  }

  clear() {
    this.logs = []
  }
}

export const testLogBuffer = new TestLogBuffer()

/**
 * ===============================
 * Winston Logger
 * ===============================
 */
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `${timestamp} [${level.toUpperCase()}]: ${stack}`
        : `${timestamp} [${level.toUpperCase()}]: ${message}`
    })
  ),
  transports: [
    new transports.Console(),

    new transports.File({
      filename: path.join(logDir, 'app.log'),
    }),

    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    })
  ]
})

/**
 * ===============================
 * Log Wrapper Class
 * ===============================
 */
export default class Log {

  private static addToBuffer(level: string, message: string) {
    const timestamp = new Date().toISOString()
    testLogBuffer.add(`${timestamp} [${level.toUpperCase()}] ${message}`)
  }

  static info(message: string): void {
    logger.info(message)
    this.addToBuffer('info', message)
  }

  static warn(message: string): void {
    logger.warn(message)
    this.addToBuffer('warn', message)
  }

  static error(message: string, error?: unknown): void {
    if (error instanceof Error) {
      logger.error(message, error)
      this.addToBuffer('error', `${message} | ${error.stack}`)
    } else {
      logger.error(message)
      this.addToBuffer('error', message)
    }
  }

  static logError(
    className: string,
    methodName: string,
    exception: unknown
  ): void {
    const separator = '------------------------------------------------------------'

    logger.error(`ClassName: ${className}`)
    logger.error(`MethodName: ${methodName}`)
    logger.error(`Exception: ${exception instanceof Error ? exception.stack : exception}`)
    logger.error(separator)

    this.addToBuffer('error', `ClassName: ${className}`)
    this.addToBuffer('error', `MethodName: ${methodName}`)
    this.addToBuffer(
      'error',
      `Exception: ${exception instanceof Error ? exception.stack : exception}`
    )
    this.addToBuffer('error', separator)
  }
}
