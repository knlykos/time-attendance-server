import { getRepository } from "typeorm";
import { Employee } from "../../entity/employee";
import { hash, compare } from "bcrypt";
import { sign, SignOptions } from "jsonwebtoken";

interface Token extends SignOptions {
  id: string;
  role: number;
  firstName: string;
  lastName: string;
}
export class employeesController {
  async findOne(id: string) {
    try {
      const result = await getRepository(Employee).findOne({
        where: { id: id },
      });
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      const foundResult = await getRepository(Employee).find();
      return foundResult;
    } catch (error) {
      throw new Error(error);
    }
  }

  generateUsername(firstName: string, lastName: string, dateBirth: Date) {
    let firstLetter = "";
    let secondLetter = "";
    let thirdLetter = "";
    let fourthLetter = "";
    if (firstName) {
      const firstNameArray = firstName.split(" ");
      firstLetter = firstNameArray[0][0];
      if (firstNameArray.length > 1) {

        secondLetter = firstNameArray[1][0];
      } else {
        secondLetter = 'X'
      }
    }

    if (lastName) {
      const lastNameArray = lastName.split(" ");
      thirdLetter = lastNameArray[0][0];
      if (lastNameArray.length > 1) {
        fourthLetter = lastNameArray[1][0];
      } else {
        fourthLetter = 'X'
      }
      
    }
    const username = firstLetter + secondLetter + dateBirth.getDate(); + thirdLetter + fourthLetter;
    return username;
  }

  async create(employee: Employee) {
    try {
      const createdemployee = await getRepository(Employee).save(employee);
      return createdemployee;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(employee: Employee) {
    try {
      const updatedEmployee = await getRepository(Employee).update(
        { id: employee.id },
        employee
      );
      return updatedEmployee;
    } catch (error) {
      throw new Error(error);
    }
  }

  // async signup(username: string, password: string) {
  //   try {
  //     const passwordHashed = await new Promise<string>((resolve, reject) => {
  //       hash(password, 10, (err, hash) => {
  //         if (err) {
  //           reject(err);
  //         }
  //         resolve(hash);
  //       });
  //     });
  //     const employee = new Employee();
  //     employee.username = username;
  //     employee.password = passwordHashed;

  //     employee.createdBy = "";
  //     employee.updatedBy = "";
  //     employee.deleteBy = "";
  //     const result = await getRepository(Employee).save(employee);
  //     return result;
  //   } catch (error) {
  //     // console.log(error);
  //     throw new Error(error);
  //   }
  // }

  async login(username: string, password: string) {
    try {
      const employee = await getRepository(Employee).findOne({
        where: { username: username },
      });

      const passwordHashed = await new Promise<boolean>((resolve, reject) => {
        compare(password, employee.password, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      });
      if (passwordHashed === true) {
        const singData: Token = {
          issuer: "NKODEX",
          subject: employee.username,
          id: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          role: employee.employeeRole,
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
