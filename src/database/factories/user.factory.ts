import { User } from "src/users/entities/user.entity";
import { setSeederFactory } from "typeorm-extension";
import { fakerVI } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

export default setSeederFactory(User, async () => {
    const user = new User();
    user.email = fakerVI.internet.email();
    user.fullName = fakerVI.person.fullName();
    user.roles = null;

    user.password = await bcrypt.hash('12345',10);

    return user;
});