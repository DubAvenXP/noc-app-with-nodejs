export enum LogSeverityLevel {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export interface LogEntityOptions {
  message: string;
  level: LogSeverityLevel;
  origin: string;
  createdAt?: Date;
}

export class LogEntity {
  public level: LogSeverityLevel;
  public message: string;
  public createdAt: Date;
  public origin: string;

  constructor(options: LogEntityOptions) {
    const { message, level, origin, createdAt = new Date() } = options;

    this.message = message;
    this.level = level;
    this.origin = origin;
    this.createdAt = createdAt;
  }

  static fromJSON = (json = '{}'): LogEntity => {
    const parsedObject = JSON.parse(json);
    return this.buildEntity(parsedObject);
  };

  static fromObject = (object: { [key: string]: any } ): LogEntity => {
    return this.buildEntity(object);
  };

  private static buildEntity(object: { [key: string]: any }): LogEntity {
    const { message, createdAt = new Date(), origin = 'log.entity.ts' } = object;
    const level = object.level.toLowerCase();

    if (typeof message !== 'string' || message.trim() === '') {
      throw new Error('Message is required and must be a non-empty string.');
    }

    if (!Object.values(LogSeverityLevel).includes(level)) {
      throw new Error('Level is required and must be a valid LogSeverityLevel.');
    }

    if (!(createdAt instanceof Date)) {
      throw new Error('CreatedAt must be a valid Date object.');
    }

    return new LogEntity({ message, level, createdAt, origin });
  }
}
