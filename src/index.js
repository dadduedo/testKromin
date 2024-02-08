import express from "express";
import * as AuthController from "./controller/Auth.js";
import * as TodoController from "./controller/Todo.js";
import auth from "./middlewares/auth.js";
import error from "./middlewares/error.js";
import asyncHandler from "./middlewares/asyncHandler.js";
import http from 'http';
import path from 'path';
import { initializeSocketIO, getSocketIOInstance} from './socket.js';
const app = express();
const server = http.createServer(app);

// Inizializza Socket.IO
initializeSocketIO(server);

const __dirname = new URL('.', import.meta.url).pathname;
app.set("json spaces", 2);
app.use(express.json());

const port = process.env.PORT;

app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));

app.use((req, res, next) => {
  req.io = getSocketIOInstance();
  req.io.emit('connected', 'connesso');
  next();
});
app.use(error);
/**
 * Routes
 */
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
  //res.sendFile(__dirname + '/index.html');
 
  //res.json({ message: "API is ready." });
  
});
//localhost:3000/api/auth/signup
//body:{"email": "giggi.dac@example.net","password": "mannaggina"}
app.post("/api/auth/signup", async (req, res) => {
  const data = await AuthController.register({ user: req.user, ...req.body });
  res.json(data);
  req.io.emit('signup', 'Utente aggiunto!');
});
//localhost:3000/api/auth/login
//body:{"email": "giggi.dac@example.net","password": "mannaggina"}
app.post(
  "/api/auth/login",
  asyncHandler(async (req, res) => {
    const data = await AuthController.login({ user: req.user, ...req.body });
    res.json(data);
    req.io.emit('login', 'Utente loggato!');
  })
);
//localhost:3000/api/todos/10000102/
//params id=10000102
app.get(
  "/api/todos/:id/",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.get({ user: req.user, ...req.params });
    res.json(data);
  })
);
//localhost:3000/api/todos/
app.get(
  "/api/todos",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.search({
      user: req.user,
      ...req.query,
    });
    res.json(data);
  })
);
//localhost:3000/api/todos/
//body{"content": "Your Todo Content","due_date": "2024-06-30 ","status": "pending","tipo":"spesa","targetTable":"todosimp"}
app.post(
  "/api/todos",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.create({ user: req.user, ...req.body });
    res.json(data);
    req.io.emit('taskInserito', 'Task Inserito!');
  })
);
//localhost:3000/api/move
//body:{"id": 10000108,"sourceTable": "todos", "destinationTable": "todosimp" }
app.post(
  "/api/move",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.moveTodo({ user: req.user, ...req.body });
    res.json(data);
    req.io.emit('taskSpostato', 'Task Spostato!');
  })
);
//localhost:3000/api/todos/100003
//Body:{"due_date": "2024-02-15T12:00:00", "content": "Aggiornamento del contenuto", "position": 2,"status": "pending", "targetTable": "todosimp" }
app.patch(
  "/api/todos/:id",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.update({
      user: req.user,
      ...req.params,
      ...req.body,
    });
    res.json(data);
    req.io.emit('taskCorretto', 'Task Corretto!');
  })
);

//localhost:3000/api/user/assign/
// per cambiare a giggi tutti i todolist che hanno spesa come tipo
//Body:{"emailToChange":"giggi.bravo@example.net","todolist":"spesa"}
// per cambiare a giggi il singolo todo
//Body:{"emailToChange":"giggi.bravo@example.net","idTodo":100003} 
app.patch(
  "/api/user/assign/",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.updateList({
      user: req.user,
      ...req.params,
      ...req.body,
    });
    if(data.singolID){
      const userIdToNotify = data.singolID;  // Sostituisci con l'ID dell'utente specifico
      req.io.to(userIdToNotify).emit('taskAssigned', 'Hai ricevuto un nuovo task!');
    }else{
      req.io.to(data).emit('updateUtente', 'La lista assegnata a utente è aggiornata!');
    }
    
    res.json(data);
  })
);

//localhost:3000/api/todos/todosimp/100008
app.delete(
  "/api/todos/:tableName/:id",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.remove({ user: req.user, ...req.params });
    res.json(data);
    req.io.emit('TaskCancellato', 'Task Cancellato con successo');
  })
);
//localhost:3000/api/todos/search
//body(opz):{"tipo":"spesa","content": "Your Todo Content","status": "pending","created_at": "2024-02-07T17:42:16.000Z","due_date": "2024-06-30T00:00:00.000Z"}
app.post(
  "/api/todos/search",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.search({ user: req.user, ...req.body });
    res.json(data);
  })
);
//localhost:3000/api/todos/order
//body:{"ids":[100014, 100015, 100016]}
app.post(
  "/api/todos/order",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.order({ user: req.user, ...req.body });
    res.json(data);
    req.io.emit('TaskOrdinati', 'Task ordinati!');
  })
);

// API per calcolare la percentuale dei task completati entro 5 giorni
//localhost:3000/api/completionPercentage?from=2023-01-01&to=2024-02-01
app.get(
  "/api/completionPercentage",
  auth,
  asyncHandler(async (req, res) => {
    const data = await TodoController.completionPercentage({ user: req.user, ...req.query});
    res.json(data);
  })
);
  
app.all("*", (req, res) => {
  res.status(404).json({ message: "page not found" });
});

//app.listen(() => console.log(`Example app listening on port ${port}`), port);
server.listen(port, '0.0.0.0');

