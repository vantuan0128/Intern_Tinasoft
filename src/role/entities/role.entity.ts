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

    // static async findDefaultRole() {
    //     // Implement your logic to retrieve the default role from the database or configuration
    //     // Here's an example:
    //     return await this.findOne({ name: 'user' }); // Assuming the default role name is 'user'
    //   }
}
