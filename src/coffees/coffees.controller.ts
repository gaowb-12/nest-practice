import { CoffeesService } from './coffees.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ParseIntPipe } from 'src/common/pipes/parse-int/parse-int.pipe';
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("coffees")
@Controller('coffees')
export class CoffeesController {
    constructor(private readonly CoffeesService: CoffeesService){}

    @ApiResponse({status: 403, description:"forbidden"})
    @Get()
    @Public()
    findAll(@Protocol("https") protocol:string, @Query() paginationQuery: PaginationQueryDto){
        return this.CoffeesService.findAll(paginationQuery)
    }

    @Get(":id")
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.CoffeesService.findOne(""+id)
    }

    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto){
        return this.CoffeesService.create(createCoffeeDto)
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateCoffeeDto: UpdateCoffeeDto){
        return this.CoffeesService.update(id, updateCoffeeDto)
    }

    @Delete(":id")
    remove(@Param("id") id: string){
        return this.CoffeesService.remove(id)
    }
}
