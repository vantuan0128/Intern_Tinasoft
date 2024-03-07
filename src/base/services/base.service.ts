import { DeleteResult, FindOneOptions, Repository } from "typeorm";
import { IBaseService } from "./i.base.service";
import { BaseEntity } from "../entities/base.entity";

export class BaseService<T extends BaseEntity> implements IBaseService<T> {
    
    private readonly repository: Repository<T>;

    constructor(repository: Repository<T>) {
        this.repository = repository;
    }

    index(): Promise<T[]> {
        return this.repository.find();
    }

    store(data: any): Promise<T> {
        return this.repository.save(data);
    }

    async update(id: string, data: any): Promise<T> {
        await this.repository.update(id, data);
        return this.findById(id);
    }

    delete(id: string): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    findById(id: string): Promise<T> {
        const findOneOptions = { where: { id }} as FindOneOptions;
        return this.repository.findOne(findOneOptions);
    }

    findByColumn<X>(column: keyof T, value: X): Promise<T> {
        const findOneOptions = { where: { [column]: value } } as FindOneOptions;
        return this.repository.findOne(findOneOptions);
    }

}