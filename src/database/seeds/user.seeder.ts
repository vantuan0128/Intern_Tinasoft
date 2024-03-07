import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

export class UserSeeder implements Seeder {
    track = false;

    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<any> {
        const items: User[] = [];

        const userFactory = await factoryManager.get(User);

        items.push(...(await userFactory.saveMany(5)));
        console.log(items);
        return items;
    }

}