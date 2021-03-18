import { getRepository } from "typeorm";
import { User } from "../../entity/user";
import { hash, compare } from "bcrypt";
import { sign, SignOptions } from "jsonwebtoken";

interface Token extends SignOptions {
  id: string;
  role: number;
  firstName: string;
  lastName: string;
}
export class UsersController {
  async findOne(id: string) {
    try {
      const result = await getRepository(User).findOne({ where: { id: id } });
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      const foundResult = await getRepository(User).find();
      return foundResult;
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(user: User) {
    hash;
    try {
      const createdUser = await getRepository(User).save(user);
      return createdUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(user: User) {
    try {
      const updatedUser = await getRepository(User).update({ id: user.id }, user);
      return updatedUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async signup(username: string, password: string) {
    try {
      const passwordHashed = await new Promise<string>((resolve, reject) => {
        hash(password, 10, (err, hash) => {
          if (err) {
            reject(err);
          }
          resolve(hash);
        });
      });
      const user = new User();
      user.username = username;
      user.password = passwordHashed;
      user.userRole = 3;
      user.createdBy = "";
      user.updatedBy = "";
      user.deleteBy = "";
      const result = await getRepository(User).save(user);
      return result;
    } catch (error) {
      // console.log(error);
      throw new Error(error);
    }
  }

  async login(username: string, password: string) {
    try {
      const user = await getRepository(User).findOne({
        where: { username: username },
      });

      const passwordHashed = await new Promise<boolean>((resolve, reject) => {
        compare(password, user.password, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      });
      if (passwordHashed === true) {
        const singData: Token = {
          issuer: "NKODEX",
          subject: user.username,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.userRole,
        };

        const token = sign(singData, "NKODEX");
        return { token: token };
      }
      throw new Error("Password not match");
    } catch (error) {
      // console.log(error);
      throw new Error(error);
    }
  }
}
