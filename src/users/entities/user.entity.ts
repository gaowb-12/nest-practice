import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity() // sql table === 'user'
export class User{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

}