import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/iam/config/jwt.config';

@Module({
    imports:[
        ConfigModule, 
        JwtModule.registerAsync(jwtConfig.asProvider()), 
        ConfigModule.forFeature(jwtConfig)
    ],
    providers:[
        {
            provide: APP_GUARD,
            useClass: AccessTokenGuard
        }
    ]
})
export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer){
        consumer.apply(LoggingMiddleware).forRoutes("*")
    }
}
