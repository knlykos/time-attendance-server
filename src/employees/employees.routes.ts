import { NextFunction, Request, Response, Router } from "express";
import { User } from "../../entity/user";
import { UsersController } from "./employees.controller";

var employeesRouter = Router();

// employeesRouter.post(
//   "/signup",
//   async (req: Request, res: Response, next: NextFunction) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const userController = new UsersController();
//     try {
//       const newUser = await userController.signup(username, password);
//       res.send(newUser);
//     } catch (error) {
//       res.status(501).send(error.message);
//     }
//   }
// );

employeesRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const password = req.body.password;
    const userController = new UsersController();
    try {
      const newUser = await userController.login(username, password);
      res.send(newUser);
    } catch (error) {
      console.log(error, "ERROR");
      res.status(501).send(error.message);
    }
  }
);
employeesRouter.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.body;

    const userController = new UsersController();
    try {
      const createdUser = await userController.create(user);
      res.send(createdUser);
    } catch (error) {
      console.log(error, "ERROR");
      res.status(501).send(error.message);
    }
  }
);
employeesRouter.get(
  "/findOne",
  async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const password = req.body.password;
    const userController = new UsersController();
    try {
      const newUser = await userController.signup(username, password);
      res.send(newUser);
    } catch (error) {
      res.status(501).send(error.message);
    }
  }
);

employeesRouter.get(
  "/findAll",
  async (req: Request, res: Response, next: NextFunction) => {
    const userController = new UsersController();
    try {
      const foundResult = await userController.findAll();
      res.send(foundResult);
    } catch (error) {
      res.status(501).send(error.message);
    }
  }
);

employeesRouter.put(
  "/edit",
  async (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.body;
    const userController = new UsersController();
    try {
      const updatedUser = await userController.update(user);
      res.send(updatedUser);
    } catch (error) {
      res.status(501).send(error.message);
    }
  }
);

module.exports = employeesRouter;
