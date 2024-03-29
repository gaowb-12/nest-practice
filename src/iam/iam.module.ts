import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';

@Module({
  imports:[
    TypeOrmModule.forFeature(
        [User]
    ),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig)
  ], 
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService
    },
    AuthenticationService
  ],
  controllers: [AuthenticationController]
})
export class IamModule {}
