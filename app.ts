import { NextFunction, Request, Response } from "express";
import { createConnection } from "typeorm";

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require('cors')

var indexRouter = require("./routes/index");
var usersRouter = require("./src/users/users.routes");
var employeesRouter = require("./src/employees/employees.routes");
var app = express();

createConnection({
  type: "postgres",
  host: "172.17.0.3",
  port: 5432,
  username: "postgres",
  password: "123456",
  database: "timeattendance",
  entities: [__dirname + "/entity/*.ts"],
  synchronize: true,
})
  .then((connection) => {
    console.log(connection.logger);

    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");

    app.use(cors())
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    app.use("/", indexRouter);
    app.use("/users", usersRouter);
    app.use("/employees", employeesRouter);

    // catch 404 and forward to error handler
    app.use(function (req: Request, res: Response, next: NextFunction) {
      next(createError(404));
    });

    // error handler
    app.use(function (
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });
  })
  .catch((error: any) => console.log(error));
// view engine setup

module.exports = app;
