import { AuthenticationService } from './authentication.service';
import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authService: AuthenticationService
    ){}
    
    
    @Post("sign-up")
    signUp(@Body() body: SignUpDto){
        return this.authService.signUp(body)
    }

    @HttpCode(HttpStatus.OK)
    @Post("sign-in")
    signIn(
        @Res({passthrough: true}) response: Response,
        @Body() body: SignInDto
    ){
        // const accessToken = await this.authService.signIn(body)
        // response.cookie('accessToken', accessToken, {
        //     secure: true,
        //     httpOnly: true,
        //     sameSite: true
        // })
        return this.authService.signIn(body)
    }
}
