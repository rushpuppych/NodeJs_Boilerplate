const chalk = require("chalk");
const path = require("path");
const express = require("express");
const nocache = require("nocache");
const mustacheExpress = require("mustache-express");

/**
 * WebSocket Server
 * This Class starts a Classic WebSocket Server and Handles all Requests and Clients.
 * @param {*} opt
 */
const WebServerRestApi = function (opt) {
   let $this = this;
   let _private = {};
   let server = null;

   // Options
   let options = Object.assign(
      {
         port: 5500,
         staticFolder: "./../static",
         viewsFolder: "./../views",
      },
      typeof opt !== "undefined" ? opt : {}
   );

   /**
    * PRIVATE: Constructor
    */
   _private.init = () => {
      server = express();

      // Set Template Engine to Mustache
      server.engine("mustache", mustacheExpress());
      server.set("view engine", "mustache");
      server.set("views", path.join(__dirname, options.viewsFolder));

      // Set HTTP Server Options
      server.use(nocache());
      server.use(express.urlencoded({ extended: true }));
      server.use(express.json());
      server.use(
         "/static",
         express.static(path.join(__dirname, options.staticFolder))
      );

      // Call Default Route Handler
      _private.handleDefaultRoutes();
   };

   /**
    * PUBLIC Listening
    * @param {*} port
    */
   this.listening = (port) => {
      port = typeof port === "undefined" ? options.port : port;
      server.listen(port);
      console.log(
         chalk.blue.bold("[REST_API] ") +
            "Server starting................ " +
            chalk.green.bold("[SUCCESS]")
      );
      console.log(
         chalk.blue.bold("[REST_API] ") +
            "REST_API Server is listening on Port: " +
            chalk.bold(options.port)
      );
   };

   /**
    * PUBLIC: AddRoute
    * Adding Route to WebServer REST API Server
    * @param {*} method
    * @param {*} path
    * @param {*} callback
    * @param {*} middleware
    */
   this.addRoute = (method, path, callback, middleware) => {
      method = method.toLowerCase();
      if (typeof server[method] === "undefined") return false;
      if (typeof callback !== "function") return false;
      if (typeof middleware === "function") {
         server[method](path, middleware, callback);
      } else {
         server[method](path, callback);
      }
      return true;
   };

   /**
    * PRIVATE: HandleDefaultRoutes
    * This handles the buildin REST Routes.
    */
   _private.handleDefaultRoutes = () => {
      // Add Middleware Error Handler
      server.use((req, res, next) => {
         res.on("finish", () => {
            const codeStr = String(res.statusCode);
            const status = res.statusCode < 400 ? true : false;
            _private.printReq(req, status);
         });
         next();
      });
   };

   /**
    * PRIVATE: PrintReq
    * This is a Helper which is printing out all Incoming requests to the console.
    * @param {*} req
    * @param {*} isValid
    */
   _private.printReq = (req, isValid) => {
      let ip = (
         req.headers["x-forwarded-for"] ||
         req.connection.remoteAddress ||
         ""
      )
         .split(",")[0]
         .trim();

      let prefix = chalk.green.bold("VALID REQUEST ");
      if (!isValid) {
         prefix = chalk.red.bold("INVALID REQUEST ");
      }

      console.log(
         chalk.blue.bold("[REST_API] ") +
            prefix +
            chalk.bold("FROM") +
            ": " +
            (ip == "::1" ? "localhost" : ip) +
            " " +
            chalk.bold("URL") +
            ": " +
            req.method +
            " " +
            req.url
      );
   };

   // Call Init
   _private.init();
};
module.exports = WebServerRestApi;
