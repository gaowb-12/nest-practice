import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from "express"
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/iam/config/jwt.config';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>, 
  ){

  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublicClass = this.reflector.get(IS_PUBLIC_KEY, context.getClass());
    if(isPublicClass){
      return true
    }
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if(isPublic){
      return true
    }
    
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if(!token){
      throw  new UnauthorizedException("token is not existed")
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration
      );
      request["user"] = payload
      console.log(payload)
    } catch (error) {
      throw  new UnauthorizedException(error)
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined{
    const [_, token] = request.headers.authorization?.split(" ") ?? []
    return token;
  }
}
