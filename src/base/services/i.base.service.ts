import { DeleteResult } from "typeorm";
import { BaseEntity } from "../entities/base.entity";

export interface IBaseService<T extends BaseEntity> {
    index(): Promise<T[]>;

    store(data: any): Promise<T>;

    update(id: string, data: any): Promise<T>;

    delete(id: string): Promise<DeleteResult>;

    findById(id: string): Promise<T | null>;

    findByColumn<X>(column: keyof T, value: X): Promise<T | null>;
}