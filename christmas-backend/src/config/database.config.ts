import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

export const databaseConfig = {
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    console.log('Database config loaded');
    console.log(`DB_HOST: ${configService.get<string>('DB_HOST')}`);
    console.log(`DB_PORT: ${configService.get<number>('DB_PORT')}`);
    console.log(`DB_USERNAME: ${configService.get<string>('DB_USERNAME')}`);
    console.log(`DB_PASSWORD: ${configService.get<string>('DB_PASSWORD')}`);
    console.log(`DB_DATABASE: ${configService.get<string>('DB_DATABASE')}`);
    console.log(`dia elegido: ${process.env.DAY}`);

    return {
      type: 'mysql',
      host: configService.get<string>('DB_HOST', 'localhost'),
      port: configService.get<number>('DB_PORT', 3306),
      username: configService.get<string>('DB_USERNAME', 'root'),
      password: configService.get<string>('DB_PASSWORD', ''),
      database: configService.get<string>('DB_DATABASE', 'my_db'),
      entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
      synchronize: configService.get<boolean>('DB_SYNC', false),
      migrations: [path.resolve(__dirname, 'migrations', '*{.ts,.js}')],
      logging: configService.get<boolean>('DB_LOGGING', false),
    };
  },
  inject: [ConfigService],
};
