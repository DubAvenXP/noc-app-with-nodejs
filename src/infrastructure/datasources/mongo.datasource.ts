import { logModel } from '../../data/mongo';
import { LogDataSource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

export class MongoDatasource implements LogDataSource {
  async saveLog(log: LogEntity): Promise<void> {
    const newLog = await logModel.create(log);
    console.log(`Log saved with id: ${newLog.id} on MongoDB`);
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const logs = await logModel.find({
      level: severityLevel,
    });

    return logs.map(LogEntity.fromObject);
  }
}
