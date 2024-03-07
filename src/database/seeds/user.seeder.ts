import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

export default class UserSeeder implements Seeder {
    track = false;

    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository =  dataSource.getRepository(User);
        await repository.insert([
            {
                fullName: 'Nguyen Van Tuan',
                email: 'admin@gmail.com'
            }
        ]);

        // ---------------------------------------------------

        const userFactory = factoryManager.get(User);
        await userFactory.save();
        await userFactory.saveMany(5);
    }
}