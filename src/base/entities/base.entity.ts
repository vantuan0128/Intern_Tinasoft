import { CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn({
        default: `now()`,
    })
    createdAt: Date;

    @UpdateDateColumn({
        nullable: true,
        default: `now()`,
    })
    updatedAt: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    deletedAt: Date;
}