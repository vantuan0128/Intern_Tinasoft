import { BaseEntity } from "src/base/entities/base.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Role extends BaseEntity{

    @Column()
    name: string;

    @Column()
    description: string;

    users: User[];
}
