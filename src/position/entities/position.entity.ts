import { BaseEntity } from "src/base/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity()
export class Position extends BaseEntity{
    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(() => User)
    users: User[]

}
