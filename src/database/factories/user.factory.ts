import { User } from "src/users/entities/user.entity";
import { setSeederFactory } from "typeorm-extension";
import { fakerVI } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

export default setSeederFactory(User, () => {
    const user = new User();
    user.email = fakerVI.internet.email();
    user.fullName = fakerVI.person.fullName();
    user.roles = null;

    bcrypt.hash('12345', 10, (err, hash) => {
        if (err) {
            console.error(err);
        } else {
            user.password = hash;
        }
    });

    return user;
});