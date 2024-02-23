import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from "../events/entities/event.entity"
import { ConfigType } from '@nestjs/config';
import coffeesConfig from "./config/coffee.config"

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: DataSource,
    ){
        
    }

    findAll(paginationQuery: PaginationQueryDto){
        let { limit, offset } = paginationQuery
        return this.coffeeRepository.find({ 
            relations:['flavors'],
            skip: offset,
            take: limit
        })
    }

    async findOne(id: string){
        const coffee = await this.coffeeRepository.findOne({
            where: {
                id: +id
            },
            relations:['flavors']
        })
        if(!coffee){
            throw new HttpException(`coffee #${id} not found`, HttpStatus.NOT_FOUND)
        }
        return coffee
    }

    async create(createCoffeeDto: CreateCoffeeDto){
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        )
        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors
        })
        return this.coffeeRepository.save(coffee)
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto){
        const flavors = updateCoffeeDto.flavors && await Promise.all(
            updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        )
        const existingCoffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors
        })
        if(!existingCoffee){
            throw new HttpException(`coffee #${id} not found`, HttpStatus.NOT_FOUND)
        }
        return this.coffeeRepository.save(existingCoffee)
    }

    async remove(id:string){
        const coffee = await this.findOne(id)
        return this.coffeeRepository.remove(coffee)
    }

    async recommendCoffee(coffee: Coffee){
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            coffee.recommendations++;
            const recommendEvent = new Event();
            recommendEvent.name = "recommend_coffee"
            recommendEvent.type = "coffee"
            recommendEvent.payload = {id: coffee.id}

            await queryRunner.manager.save(coffee)
            await queryRunner.manager.save(recommendEvent)

            await queryRunner.commitTransaction()
        } catch (error) {
            await queryRunner.rollbackTransaction()
        }finally{
            await queryRunner.release()
        }
    }

    private async preloadFlavorByName(name: string){
        const flavor = await this.flavorRepository.findOne({
            where: {
                name
            },
        })
        if(flavor){
            return flavor
        }
        return this.flavorRepository.create({name})
    }

}
