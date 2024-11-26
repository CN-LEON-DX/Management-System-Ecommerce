import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import methodOverride from "method-override";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "express-flash";
import moment from "moment";
import http from "http";
import { Server } from "socket.io";

// Environment variables
dotenv.config();

// Import custom modules
import { connectDB } from "./config/database";
import routeClient from "./routers/client/index.route";
import routeAdmin from "./routers/admin/index.route";

// Initialize the Express app
const app: Application = express();

// Middleware configuration
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Flash message middleware
app.use(cookieParser("CN-LEON-DX")); // Secret key
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "CN-LEON-DX",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Database connection
connectDB();

// Configure the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Socket.io setup
const server = http.createServer(app);
const io = new Server(server);
(global as any)._io = io;
export { io };

// Static folder configuration
app.use(express.static(path.join(__dirname, "public")));

// TinyMCE static files
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// Moment.js integration
app.locals.moment = moment;

// Routes
routeClient(app);
routeAdmin(app);

// 404 Page
app.get("*", (req: Request, res: Response) => {
  res.status(404).render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
