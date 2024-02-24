import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import usersConfig from "./config/user.config"
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature(
        [User]
    ),
    ConfigModule.forFeature(usersConfig)
], 
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}

