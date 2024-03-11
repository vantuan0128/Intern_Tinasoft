import { InjectRepository } from "@nestjs/typeorm";
import { BaseEntity } from "src/base/entities/base.entity";
import { Position } from "src/position/entities/position.entity";
import { Role } from "src/role/entities/role.entity";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, Repository } from "typeorm";

@Entity()
export class User extends BaseEntity {

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    fullName: string;

    @Column({
        type: 'date',
        nullable: true
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

    @ManyToMany(() => Role, { cascade: true, eager: true })
    @JoinTable()
    roles?: Role[];

    @ManyToMany(() => Position, { cascade: true, eager: true })
    @JoinTable()
    positions?: Position[];

    @InjectRepository(Role)
    private roleRepository: Repository<Role>;

    @BeforeInsert()
    async assignDefaultRole() {
        const defaultRole = await this.roleRepository.findOne({
            where: { name: "user" }
        });

        if (defaultRole) {
            this.roles = [defaultRole];
        } else {
            console.warn('Default user role not found. User created without a role.');
        }
    }
}
