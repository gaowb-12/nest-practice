import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from "../events/entities/event.entity"
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from "./config/coffee.config"

@Module({
    imports:[
        TypeOrmModule.forFeature(
            [Coffee, Flavor, Event]
        ),
        ConfigModule.forFeature(coffeesConfig)
    ], 
    controllers:[CoffeesController],
    providers:[CoffeesService]
})
export class CoffeesModule {}