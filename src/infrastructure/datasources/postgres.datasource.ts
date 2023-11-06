import { PrismaClient, SeverityLevel } from '@prisma/client';
import { LogDataSource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

const severityEnum = {
  low: SeverityLevel.LOW,
  medium: SeverityLevel.MEDIUM,
  high: SeverityLevel.HIGH,
};

export class PostgresDatasource implements LogDataSource {
  private readonly prismaClient: PrismaClient;

  constructor(
    prismaClient: PrismaClient = new PrismaClient(),
  ) {
    this.prismaClient = prismaClient;
  }

  async saveLog(log: LogEntity): Promise<void> {
    const level = severityEnum[log.level];
    const newLog = await this.prismaClient.log.create({
      data: { ...log, level },
    });
    console.log(`Log saved with id: ${newLog.id} on Postgres`);
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const logs = await this.prismaClient.log.findMany({
      where: {
        level: severityEnum[severityLevel],
      },
    });

    return logs.map(LogEntity.fromObject);
  }
}
