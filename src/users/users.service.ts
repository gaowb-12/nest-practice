import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly connection: DataSource,
    ){}

    findAll(paginationQuery: PaginationQueryDto){
        let { limit, offset } = paginationQuery
        return []
    }

    async findOne(id: string){
        const user = await this.userRepository.findOne({
            where: {
                id: +id
            },
        })
        if(!user){
            throw new HttpException(`user #${id} not found`, HttpStatus.NOT_FOUND)
        }
        return user
    }

    async create(creatUserDto: CreateUserDto){
        const user = this.userRepository.create({
            ...creatUserDto
        })
        return this.userRepository.save(user)
    }

    async update(id: string, updateUserDto: UpdateUserDto){
        const existingUser = await this.userRepository.preload({
            id: +id,
            ...updateUserDto
        })
        if(!existingUser){
            throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND)
        }
        return this.userRepository.save(existingUser)
    }

    async remove(id:string){
        const user = await this.findOne(id)
        return this.userRepository.remove(user)
    }
    
}
