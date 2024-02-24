import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiTags("users")
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @ApiResponse({status: 403, description:"forbidden"})
    @Get()
    @Public()
    findAll( @Query() paginationQuery: PaginationQueryDto){
        return this.usersService.findAll(paginationQuery)
    }

    @Get(":id")
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.usersService.findOne(""+id)
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto){
        return this.usersService.create(createUserDto)
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto){
        return this.usersService.update(id, updateUserDto)
    }

    @Delete(":id")
    remove(@Param("id") id: string){
        return this.usersService.remove(id)
    }
    
}

