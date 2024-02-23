import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: () => void) {
    console.time("Response time")
    console.log("hi from middleware")
    res.on("finish", ()=>console.timeEnd("Response time"))
    next();
  }
}
