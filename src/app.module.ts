import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import * as Joi from '@hapi/joi';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: Joi.object({
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_HOST: Joi.required()
      })
    }),
    CoffeesModule, 
    TypeOrmModule.forRootAsync({
      useFactory:() => ({
        type: "postgres",
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT, 
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true
      })
    }), CommonModule, UsersModule, IamModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
