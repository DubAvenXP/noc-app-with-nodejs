import { PrismaClient, SeverityLevel } from '@prisma/client';
import { LogDataSource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

const prismaClient = new PrismaClient();
const severityEnum = {
  low: SeverityLevel.LOW,
  medium: SeverityLevel.MEDIUM,
  high: SeverityLevel.HIGH,
};

export class PostgresDatasource implements LogDataSource {
  private readonly logModel = prismaClient.log;

  async saveLog(log: LogEntity): Promise<void> {
    const level = severityEnum[log.level];
    const newLog = await this.logModel.create({
      data: { ...log, level },
    });
    console.log(`Log saved with id: ${newLog.id} on Postgres`);
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const logs = await this.logModel.findMany({
      where: {
        level: severityEnum[severityLevel],
      },
    });

    return logs.map(LogEntity.fromObject);
  }
}
