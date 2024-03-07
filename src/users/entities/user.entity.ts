import { BaseEntity } from "src/base/entities/base.entity";
import { Position } from "src/position/entities/position.entity";
import { Role } from "src/role/entities/role.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";


@Entity()
export class User extends BaseEntity{

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    fullName: string;

    @Column({
        type: 'date',
        nullable:true
    })
    birthday: Date; 

    @Column({
        default: 'true'
    })
    isVerified: string;

    @Column({
        nullable: true
    })
    refresh_token: string;

    @Column({
        nullable: true
    })
    otp: string;

    @ManyToMany(() => Role, {cascade: true, eager: true})
    @JoinTable()
    roles?: Role[];

    @ManyToMany(() => Position, {cascade: true, eager: true})
    @JoinTable()
    positions?: Position[];
}
