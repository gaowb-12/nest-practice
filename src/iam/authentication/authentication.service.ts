import { SignUpDto } from './dto/sign-up.dto';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ){}
    async signUp(signUpDto: SignUpDto){
        const user = await this.userRepository.findOneBy({
            username: signUpDto.username
        })
        if(user){
            throw new UnauthorizedException('User has been existed')
        }
        try {
            const user = new User()
            user.username = signUpDto.username
            user.password = await this.hashingService.hash(signUpDto.password)
            return this.userRepository.save(user)
        } catch (error) {
            throw error
        }
    }

    async signIn(signInDto: SignInDto){
        const user = await this.userRepository.findOneBy({
            username: signInDto.username
        })
        if(!user){
            throw new UnauthorizedException('User does not exist')
        }
        const isEqual = await this.hashingService.compare(
            signInDto.password,
            user.password
        )
        
        if(!isEqual){
            throw new UnauthorizedException('password does not match')
        }
        const accessToken = await this.jwtService.signAsync(
            { sub: user.id, username: user.username },
            { 
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.accessTokenTtl
            }
        );
        return {
            accessToken
        }
    }
}
