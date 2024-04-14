import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './db/database.config';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';


@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot(databaseConfig),
    EmailModule,
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
